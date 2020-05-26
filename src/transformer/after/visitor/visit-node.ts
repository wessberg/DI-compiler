import { TS } from "../../../type/type";
import { visitRootBlockSourceFile } from "./visit-root-block-source-file";
import { AfterVisitorOptions } from "../after-visitor-options";
import { visitRootBlockBlock } from "./visit-root-block-block";
import { visitDefineArrayLiteralExpression } from "./visit-define-array-literal-expression";

export function visitNode<T extends TS.Node>(
  options: AfterVisitorOptions<T>
): TS.VisitResult<TS.Node> {
  if (
    options.context.typescript.isSourceFile(options.node) &&
    options.rootBlock === options.node
  ) {
    return visitRootBlockSourceFile({ ...options, node: options.node });
  } else if (
    options.context.typescript.isBlock(options.node) &&
    options.rootBlock === options.node
  ) {
    return visitRootBlockBlock({ ...options, node: options.node });
  } else if (
    options.context.typescript.isArrayLiteralExpression(options.node) &&
    options.defineArrayLiteralExpression === options.node
  ) {
    return visitDefineArrayLiteralExpression({
      ...options,
      node: options.node,
    });
  }

  return options.childContinuation(options.node);
}
