import { CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER } from "../../constant";
import { TS } from "../../../type/type";
import { BeforeVisitorOptions } from "../before-visitor-options";

export function visitClassLikeDeclaration(
  options: BeforeVisitorOptions<TS.ClassLikeDeclaration>
): TS.VisitResult<TS.Node> {
  const {
    node,
    childContinuation,
    continuation,
    context: { typescript },
  } = options;
  const constructorDeclaration = node.members.find(
    typescript.isConstructorDeclaration
  );

  // If there are no constructor declaration for the ClassLikeDeclaration, there's nothing to do
  if (constructorDeclaration == null) {
    return childContinuation(node);
  }

  const updatedClassMembers: readonly TS.ClassElement[] = [
    ...(node.members.map(continuation) as TS.ClassElement[]),
    typescript.createGetAccessor(
      undefined,
      [
        typescript.createModifier(typescript.SyntaxKind.PublicKeyword),
        typescript.createModifier(typescript.SyntaxKind.StaticKeyword),
      ],
      typescript.createComputedPropertyName(
        typescript.createIdentifier(
          `Symbol.for("${CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER}")`
        )
      ),
      [],
      undefined,
      typescript.createBlock([
        typescript.createReturn(
          getParameterTypeNamesAsArrayLiteral(
            constructorDeclaration.parameters,
            typescript
          )
        ),
      ])
    ),
  ];

  if (typescript.isClassDeclaration(node)) {
    return typescript.updateClassDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      updatedClassMembers
    );
  } else {
    return typescript.updateClassExpression(
      node,
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
  typescript: typeof TS
): TS.ArrayLiteralExpression {
  const constructorParams: TS.Expression[] = [];

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    // If the parameter has no type, there's nothing to extract
    if (parameter.type == null) {
      constructorParams[i] = typescript.createIdentifier("undefined");
    } else {
      constructorParams[i] = typescript.createStringLiteral(
        parameter.type.getFullText().trim()
      );
    }
  }

  return typescript.createArrayLiteral(constructorParams);
}
