import { DI_CONTAINER_NAME, TYPE_NODE_CONSOLE_LOG_MARK } from "../../constant";
import { TS } from "../../../type/type";
import { BeforeVisitorOptions } from "../before-visitor-options";
import { DiMethodKind } from "../../di-method-kind";
import { VisitorContext } from "../../visitor-context";

export function visitCallExpression(
  options: BeforeVisitorOptions<TS.CallExpression>
): TS.VisitResult<TS.Node> {
  const {
    node,
    addTrailingStatements,
    childContinuation,
    continuation,
    context,
  } = options;
  const { typescript } = context;

  const diMethod = getDiMethodKind(node.expression, context);

  if (diMethod != null) {
    switch (diMethod) {
      case DiMethodKind.GET:
      case DiMethodKind.HAS: {
        // If no type arguments are given, don't modify the node at all
        if (node.typeArguments == null || node.typeArguments[0] == null) {
          return childContinuation(node);
        }

        return typescript.updateCall(
          node,
          node.expression,
          node.typeArguments,
          [
            typescript.createObjectLiteral([
              typescript.createPropertyAssignment(
                "identifier",
                typescript.createStringLiteral(
                  node.typeArguments[0].getFullText().trim()
                )
              ),
            ]),
          ]
        );
      }

      case DiMethodKind.REGISTER_SINGLETON:
      case DiMethodKind.REGISTER_TRANSIENT: {
        let [typeArg, implementationArg] = ((node.typeArguments ??
          []) as unknown) as [
          TS.TypeNode | TS.Expression | undefined,
          TS.TypeNode | TS.Expression | undefined
        ];

        // If not implementation is provided, use the type argument *as* the implementation
        if (implementationArg == null) {
          implementationArg = typeArg;
        }

        // If another implementation is passed, used that one instead
        if (node.arguments.length > 0) {
          implementationArg = node.arguments[0];
        }

        if (typeArg == null || implementationArg == null) {
          return childContinuation(node);
        }

        const typeArgText = typeArg.getFullText().trim();
        const implementationArgText = implementationArg.getFullText().trim();

        // If the Implementation is a TypeNode, it may be stripped from the file since Typescript won't Type-check the updates from
        // a CustomTransformer and such a node would normally be removed from the imports.
        // to fix it, add an ExpressionStatement such as '"foo", Foo' (that will be removed later)
        if (typescript.isTypeNode(implementationArg)) {
          addTrailingStatements(
            typescript.createExpressionStatement(
              typescript.createBinary(
                typescript.createStringLiteral(TYPE_NODE_CONSOLE_LOG_MARK),
                typescript.SyntaxKind.CommaToken,
                typescript.createIdentifier(implementationArgText)
              )
            )
          );
        }

        return typescript.updateCall(
          node,
          node.expression,
          node.typeArguments,
          [
            typescript.isTypeNode(implementationArg)
              ? typescript.createIdentifier("undefined")
              : (continuation(implementationArg) as TS.Expression),
            typescript.createObjectLiteral([
              typescript.createPropertyAssignment(
                "identifier",
                typescript.createStringLiteral(typeArgText)
              ),
              ...(!typescript.isTypeNode(implementationArg)
                ? []
                : [
                    typescript.createPropertyAssignment(
                      "implementation",
                      typescript.createIdentifier(implementationArgText)
                    ),
                  ]),
            ]),
          ]
        );
      }
    }
  }

  return childContinuation(node);
}

function getDiMethodKind(
  node: TS.Expression,
  context: VisitorContext
): DiMethodKind | undefined {
  if (
    !context.typescript.isPropertyAccessExpression(node) &&
    !context.typescript.isElementAccessExpression(node)
  ) {
    return undefined;
  }

  // Don't proceed unless the left-hand expression is the DIServiceContainer
  const type = context.typeChecker.getTypeAtLocation(node.expression);

  if (
    type == null ||
    type.symbol == null ||
    type.symbol.escapedName !== DI_CONTAINER_NAME
  ) {
    return undefined;
  }

  let name: string;

  // If it is an element access expression, evaluate the argument expression
  if (context.typescript.isElementAccessExpression(node)) {
    const evaluationResult = context.evaluate(node.argumentExpression);

    // If no value could be computed, or if the value isn't of type string, do nothing
    if (
      !evaluationResult.success ||
      typeof evaluationResult.value !== "string"
    ) {
      return undefined;
    } else {
      name = evaluationResult.value;
    }
  } else {
    name = node.name.text;
  }

  switch (name) {
    case DiMethodKind.GET:
    case DiMethodKind.HAS:
    case DiMethodKind.REGISTER_SINGLETON:
    case DiMethodKind.REGISTER_TRANSIENT:
      return name;
    default:
      return undefined;
  }
}
