import { CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER } from "../../constant";
import { TS } from "../../../type/type";
import { BeforeVisitorOptions } from "../before-visitor-options";
import { VisitorContext } from "../../visitor-context";
import { pickServiceOrImplementationName } from "../util";

export function visitClassLikeDeclaration(
  options: BeforeVisitorOptions<TS.ClassLikeDeclaration>
): TS.VisitResult<TS.Node> {
  const { node, childContinuation, continuation, context } = options;
  const { typescript, factory } = context;
  const constructorDeclaration = node.members.find(
    typescript.isConstructorDeclaration
  );

  // If there are no constructor declaration for the ClassLikeDeclaration, there's nothing to do
  if (constructorDeclaration == null) {
    return childContinuation(node);
  }

  const updatedClassMembers: readonly TS.ClassElement[] = [
    ...(node.members.map(continuation) as TS.ClassElement[]),
    factory.createGetAccessorDeclaration(
      undefined,
      [
        factory.createModifier(typescript.SyntaxKind.PublicKeyword),
        factory.createModifier(typescript.SyntaxKind.StaticKeyword),
      ],
      factory.createComputedPropertyName(
        factory.createIdentifier(
          `Symbol.for("${CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER}")`
        )
      ),
      [],
      undefined,
      factory.createBlock([
        factory.createReturnStatement(
          getParameterTypeNamesAsArrayLiteral(
            constructorDeclaration.parameters,
            context
          )
        ),
      ])
    ),
  ];

  if (typescript.isClassDeclaration(node)) {
    return factory.updateClassDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      updatedClassMembers
    );
  } else {
    return factory.updateClassExpression(
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
  const { factory } = context;
  const constructorParams: TS.Expression[] = [];

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    // If the parameter has no type, there's nothing to extract
    if (parameter.type == null) {
      constructorParams[i] = factory.createIdentifier("undefined");
    } else {
      constructorParams[i] = factory.createNoSubstitutionTemplateLiteral(
        pickServiceOrImplementationName(parameter.type, context)
      );
    }
  }

  return factory.createArrayLiteralExpression(constructorParams);
}
