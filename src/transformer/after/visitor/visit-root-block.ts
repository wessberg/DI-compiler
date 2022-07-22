import {TS} from "../../../type/type.js";
import {AfterVisitorOptions} from "../after-visitor-options.js";
import {generateImportStatementForImportedSymbolInContext, getRootBlockInsertionPosition, isImportedSymbolImported} from "../../../util/ts-util.js";
import {RootBlock} from "../../../type/root-block.js";

export function visitRootBlock(options: AfterVisitorOptions<RootBlock>): TS.Statement[] {
	const {node, sourceFile, context} = options;
	const {typescript} = context;

	const leadingExtraStatements: TS.Statement[] = [];

	for (const importedSymbol of context.sourceFileToRequiredImportedSymbolSet.get(sourceFile.fileName) ?? new Set()) {
		if (isImportedSymbolImported(importedSymbol, node, context)) continue;

		const missingImportStatement = generateImportStatementForImportedSymbolInContext(importedSymbol, context);

		if (missingImportStatement != null) {
			leadingExtraStatements.push(missingImportStatement);
		}
	}

	const insertPosition = getRootBlockInsertionPosition(node, typescript);

	return [...node.statements.slice(0, insertPosition), ...leadingExtraStatements, ...node.statements.slice(insertPosition)];
}
