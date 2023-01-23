import type {TS} from "../../../type/type.js";
import type {AfterVisitorOptions} from "../after-visitor-options.js";
import {visitRootBlock} from "./visit-root-block.js";

export function visitRootBlockSourceFile(options: AfterVisitorOptions<TS.SourceFile>): TS.VisitResult<TS.Node> {
	const {node, context} = options;
	const {factory} = context;

	return factory.updateSourceFile(
		node,
		visitRootBlock(options),
		node.isDeclarationFile,
		node.referencedFiles,
		node.typeReferenceDirectives,
		node.hasNoDefaultLib,
		node.libReferenceDirectives
	);
}
