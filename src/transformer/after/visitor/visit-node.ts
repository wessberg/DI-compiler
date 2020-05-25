import { AfterVisitorOptions } from "../after-visitor-options";
import { TS } from "../../../type/type";
import { visitExpressionStatement } from "./visit-expression-statement";

export function visitNode<T extends TS.Node>(
  options: AfterVisitorOptions<T>
): TS.VisitResult<TS.Node> {
  if (options.context.typescript.isExpressionStatement(options.node)) {
    return visitExpressionStatement({ ...options, node: options.node });
  }

  return options.childContinuation(options.node);
}
