import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";
import { updateArrayLiteralExpression } from "../../../util/ts-util";

export function visitDefineArrayLiteralExpression(
  options: AfterVisitorOptions<TS.ArrayLiteralExpression>
): TS.ArrayLiteralExpression {
  const { node, sourceFile, context } = options;
  const { typescript, compatFactory } = context;

  const trailingExtraExpressions: TS.Expression[] = [];

  for (const importedSymbol of context.sourceFileToRequiredImportedSymbolSet.get(
    sourceFile.fileName
  ) ?? new Set()) {
    // Skip the node if it is already declared as a dependency
    if (
      node.elements.some(
        (element) =>
          typescript.isStringLiteralLike(element) &&
          element.text === importedSymbol.moduleSpecifier
      )
    ) {
      continue;
    }

    trailingExtraExpressions.push(
      compatFactory.createStringLiteral(importedSymbol.moduleSpecifier)
    );
  }

  if (
    context.sourceFileToAddTslibDefinition.get(sourceFile.fileName) === true
  ) {
    trailingExtraExpressions.push(compatFactory.createStringLiteral("tslib"));
  }

  if (trailingExtraExpressions.length < 1) {
    return node;
  }

  return updateArrayLiteralExpression(context, node, [
    ...node.elements,
    ...trailingExtraExpressions,
  ]);
}
