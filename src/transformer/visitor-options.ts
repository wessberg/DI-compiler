import type {TS} from "../type/type.js";
import type {VisitorContext} from "./visitor-context.js";
import type {VisitorContinuation} from "./visitor-continuation.js";

export interface VisitorOptions<T extends TS.Node> {
	node: T;
	sourceFile: TS.SourceFile;
	context: VisitorContext;
	continuation: VisitorContinuation<TS.Node>;
	childContinuation: VisitorContinuation<TS.Node>;
}
