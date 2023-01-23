import type {BaseVisitorContext, VisitorContext} from "../visitor-context.js";
import type {TS} from "../../type/type.js";
import type {AfterVisitorOptions} from "./after-visitor-options.js";
import {visitNode} from "./visitor/visit-node.js";
import {getDefineArrayLiteralExpression, getRootBlock} from "../../util/ts-util.js";
import {ensureNodeFactory} from "compatfactory";

type SourceFileWithEmitNodes = TS.SourceFile & {
	emitNode?: {
		helpers?: TS.EmitHelper[];
	};
};

export function afterTransformer(context: BaseVisitorContext): TS.TransformerFactory<TS.SourceFile> {
	return transformationContext => {
		const factory = ensureNodeFactory(transformationContext.factory ?? context.typescript);

		return sourceFile =>
			transformSourceFile(sourceFile, {
				...context,
				transformationContext,
				factory
			});
	};
}

function transformSourceFile(sourceFile: SourceFileWithEmitNodes, context: VisitorContext): TS.SourceFile {
	// For TypeScript versions below 3.5, there may be instances
	// where EmitHelpers such as __importDefault or __importStar is duplicated.
	// For these TypeScript versions, well have to guard against this behavior
	if (sourceFile.emitNode != null && sourceFile.emitNode.helpers != null) {
		const seenNames = new Set();
		const filtered = sourceFile.emitNode.helpers.filter(helper => {
			if (seenNames.has(helper.name)) return false;
			seenNames.add(helper.name);
			return true;
		});

		// Reassign the emitNodes if they changed
		if (filtered.length !== sourceFile.emitNode.helpers.length) {
			sourceFile.emitNode.helpers = filtered;
		}
	}

	const visitorOptions: Omit<AfterVisitorOptions<TS.Node>, "node" | "sourceFile"> = {
		context,
		defineArrayLiteralExpression: getDefineArrayLiteralExpression(sourceFile, context),
		rootBlock: getRootBlock(sourceFile, context),

		continuation: node =>
			visitNode({
				...visitorOptions,
				sourceFile,
				node
			}),
		childContinuation: node =>
			context.typescript.visitEachChild(
				node,
				cbNode =>
					visitNode({
						...visitorOptions,
						sourceFile,
						node: cbNode
					}),
				context.transformationContext
			)
	};

	return visitorOptions.continuation(sourceFile) as TS.SourceFile;
}
