import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";

export function visitDefineArrayLiteralExpression(
  options: AfterVisitorOptions<TS.ArrayLiteralExpression>
): TS.ArrayLiteralExpression {
  const { node, sourceFile, context } = options;
  const { typescript } = context;

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
      typescript.createStringLiteral(importedSymbol.moduleSpecifier)
    );
  }

  if (
    context.sourceFileToAddTslibDefinition.get(sourceFile.fileName) === true
  ) {
    trailingExtraExpressions.push(typescript.createStringLiteral("tslib"));
  }

  if (trailingExtraExpressions.length < 1) {
    return node;
  }

  return typescript.updateArrayLiteral(node, [
    ...node.elements,
    ...trailingExtraExpressions,
  ]);
}
