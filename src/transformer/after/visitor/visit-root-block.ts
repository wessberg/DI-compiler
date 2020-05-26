import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";
import {
  generateImportStatementForImportedSymbolInContext,
  getRootBlockInsertionPosition,
  isImportedSymbolImported,
} from "../../../util/ts-util";
import { RootBlock } from "../../../type/root-block";

export function visitRootBlock(
  options: AfterVisitorOptions<RootBlock>
): TS.Statement[] {
  const { node, sourceFile, context } = options;
  const { typescript } = context;

  const leadingExtraStatements: TS.Statement[] = [];

  for (const importedSymbol of context.sourceFileToRequiredImportedSymbolSet.get(
    sourceFile.fileName
  ) ?? new Set()) {
    if (isImportedSymbolImported(importedSymbol, node, context)) continue;

    const missingImportStatement = generateImportStatementForImportedSymbolInContext(
      importedSymbol,
      context
    );

    if (missingImportStatement != null) {
      leadingExtraStatements.push(missingImportStatement);
    }
  }

  const insertPosition = getRootBlockInsertionPosition(node, typescript);

  return [
    ...node.statements.slice(0, insertPosition),
    ...leadingExtraStatements,
    ...node.statements.slice(insertPosition),
  ];
}
