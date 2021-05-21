import { CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER } from "../../constant";
import { TS } from "../../../type/type";
import { BeforeVisitorOptions } from "../before-visitor-options";
import {
  createArrayLiteralExpression,
  createGetAccessorDeclaration,
  createReturnStatement,
  updateClassExpression,
} from "../../../util/ts-util";
import { VisitorContext } from "../../visitor-context";

export function visitClassLikeDeclaration(
  options: BeforeVisitorOptions<TS.ClassLikeDeclaration>
): TS.VisitResult<TS.Node> {
  const { node, childContinuation, continuation, context } = options;
  const { typescript, compatFactory } = context;
  const constructorDeclaration = node.members.find(
    typescript.isConstructorDeclaration
  );

  // If there are no constructor declaration for the ClassLikeDeclaration, there's nothing to do
  if (constructorDeclaration == null) {
    return childContinuation(node);
  }

  const updatedClassMembers: readonly TS.ClassElement[] = [
    ...(node.members.map(continuation) as TS.ClassElement[]),
    createGetAccessorDeclaration(
      context,
      undefined,
      [
        compatFactory.createModifier(typescript.SyntaxKind.PublicKeyword),
        compatFactory.createModifier(typescript.SyntaxKind.StaticKeyword),
      ],
      compatFactory.createComputedPropertyName(
        compatFactory.createIdentifier(
          `Symbol.for("${CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER}")`
        )
      ),
      [],
      undefined,
      compatFactory.createBlock([
        createReturnStatement(
          context,
          getParameterTypeNamesAsArrayLiteral(
            constructorDeclaration.parameters,
            context
          )
        ),
      ])
    ),
  ];

  if (typescript.isClassDeclaration(node)) {
    return compatFactory.updateClassDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      updatedClassMembers
    );
  } else {
    return updateClassExpression(
      context,
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      updatedClassMembers
    );
  }
}

/**
 * Takes ConstructorParams for the given NodeArray of ParameterDeclarations
 */
function getParameterTypeNamesAsArrayLiteral(
  parameters: TS.NodeArray<TS.ParameterDeclaration>,
  context: VisitorContext
): TS.ArrayLiteralExpression {
  const { compatFactory } = context;
  const constructorParams: TS.Expression[] = [];

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    // If the parameter has no type, there's nothing to extract
    if (parameter.type == null) {
      constructorParams[i] = compatFactory.createIdentifier("undefined");
    } else {
      constructorParams[i] = compatFactory.createStringLiteral(
        parameter.type.getFullText().trim()
      );
    }
  }

  return createArrayLiteralExpression(context, constructorParams);
}
