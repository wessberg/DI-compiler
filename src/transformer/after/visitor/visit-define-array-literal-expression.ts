import type {TS} from "../../../type/type.js";
import type {AfterVisitorOptions} from "../after-visitor-options.js";

export function visitDefineArrayLiteralExpression(options: AfterVisitorOptions<TS.ArrayLiteralExpression>): TS.ArrayLiteralExpression {
	const {node, sourceFile, context} = options;
	const {typescript, factory} = context;

	const trailingExtraExpressions: TS.Expression[] = [];

	for (const importedSymbol of context.sourceFileToRequiredImportedSymbolSet.get(sourceFile.fileName) ?? new Set()) {
		// Skip the node if it is already declared as a dependency
		if (node.elements.some(element => typescript.isStringLiteralLike(element) && element.text === importedSymbol.moduleSpecifier)) {
			continue;
		}

		trailingExtraExpressions.push(factory.createStringLiteral(importedSymbol.moduleSpecifier));
	}

	if (context.sourceFileToAddTslibDefinition.get(sourceFile.fileName) === true) {
		trailingExtraExpressions.push(factory.createStringLiteral("tslib"));
	}

	if (trailingExtraExpressions.length < 1) {
		return node;
	}

	return factory.updateArrayLiteralExpression(node, [...node.elements, ...trailingExtraExpressions]);
}
