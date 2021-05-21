import { TS } from "../../../type/type";
import { visitRootBlockSourceFile } from "./visit-root-block-source-file";
import { AfterVisitorOptions } from "../after-visitor-options";
import { visitRootBlockBlock } from "./visit-root-block-block";
import { visitDefineArrayLiteralExpression } from "./visit-define-array-literal-expression";

export function visitNode<T extends TS.Node>(
  options: AfterVisitorOptions<T>
): TS.VisitResult<TS.Node> {
  const {
    node,
    childContinuation,
    defineArrayLiteralExpression,
    rootBlock,
    context: { typescript },
  } = options;
  if (typescript.isSourceFile(node) && rootBlock === node) {
    return visitRootBlockSourceFile({ ...options, node });
  } else if (typescript.isBlock(node) && rootBlock === node) {
    return visitRootBlockBlock({ ...options, node });
  } else if (
    typescript.isArrayLiteralExpression(node) &&
    defineArrayLiteralExpression === node
  ) {
    return visitDefineArrayLiteralExpression({
      ...options,
      node,
    });
  }

  return childContinuation(options.node);
}
