import { TS } from "../type/type";
import { VisitorContext } from "./visitor-context";
import { VisitorContinuation } from "./visitor-continuation";

export interface VisitorOptions<T extends TS.Node> {
  node: T;
  sourceFile: TS.SourceFile;
  transformationContext: TS.TransformationContext;
  context: VisitorContext;
  continuation: VisitorContinuation<TS.Node>;
  childContinuation: VisitorContinuation<TS.Node>;
}
