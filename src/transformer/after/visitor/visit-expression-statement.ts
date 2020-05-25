import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";
import { TYPE_NODE_CONSOLE_LOG_MARK } from "../../constant";

export function visitExpressionStatement(
  options: AfterVisitorOptions<TS.ExpressionStatement>
): TS.VisitResult<TS.Node> {
  const { node, context } = options;
  const { typescript } = context;

  // Do nothing if the node isn't relevant
  if (
    !typescript.isBinaryExpression(node.expression) ||
    !typescript.isStringLiteralLike(node.expression.left) ||
    node.expression.left.text !== TYPE_NODE_CONSOLE_LOG_MARK ||
    node.expression.operatorToken.kind !== typescript.SyntaxKind.CommaToken
  ) {
    // Don't do a recursive pass in this case
    return node;
  }

  // If we're here, we an safely simply just remove the ExpressionStatement as it is not needed
  // anymore.
  return undefined;
}
