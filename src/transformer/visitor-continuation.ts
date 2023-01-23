import type {TS} from "../type/type.js";

export type VisitorContinuation<T extends TS.Node> = (node: T) => TS.VisitResult<T>;
