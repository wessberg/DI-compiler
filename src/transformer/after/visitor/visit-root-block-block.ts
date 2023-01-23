import type {TS} from "../../../type/type.js";
import type {AfterVisitorOptions} from "../after-visitor-options.js";
import {visitRootBlock} from "./visit-root-block.js";

export function visitRootBlockBlock(options: AfterVisitorOptions<TS.Block>): TS.VisitResult<TS.Node> {
	const {node, context} = options;
	const {factory} = context;

	return factory.updateBlock(node, visitRootBlock(options));
}
