import { BaseVisitorContext, VisitorContext } from "../visitor-context";
import { TS } from "../../type/type";
import { BeforeVisitorOptions } from "./before-visitor-options";
import { visitNode } from "./visitor/visit-node";
import { ImportedSymbol } from "../../type/imported-symbol";

export function beforeTransformer(
  context: BaseVisitorContext
): TS.TransformerFactory<TS.SourceFile> {
  return (transformationContext) => (sourceFile) =>
    transformSourceFile(sourceFile, {
      ...context,
      compatFactory: transformationContext.factory ?? context.typescript,
      transformationContext,
    });
}

function transformSourceFile(
  sourceFile: TS.SourceFile,
  context: VisitorContext
): TS.SourceFile {
  const requiredImportedSymbolSet = new Set<ImportedSymbol>();

  /**
   * An optimization in which every imported symbol is converted into
   * a string that can be matched against directly to guard against
   * duplicates
   */
  const requiredImportedSymbolSetFlags = new Set<string>();

  context.sourceFileToAddTslibDefinition.set(sourceFile.fileName, false);
  context.sourceFileToRequiredImportedSymbolSet.set(
    sourceFile.fileName,
    requiredImportedSymbolSet
  );

  const computeImportedSymbolFlag = (symbol: ImportedSymbol): string =>
    [
      "name",
      "propertyName",
      "moduleSpecifier",
      "isNamespaceImport",
      "isDefaultImport",
    ]
      .map(
        (property) =>
          `${property}:${symbol[property as keyof ImportedSymbol] ?? false}`
      )
      .join("|");

  const visitorOptions: Omit<
    BeforeVisitorOptions<TS.Node>,
    "node" | "sourceFile"
  > = {
    context,

    addTslibDefinition: (): void => {
      context.sourceFileToAddTslibDefinition.set(sourceFile.fileName, true);
    },

    requireImportedSymbol: (importedSymbol: ImportedSymbol): void => {
      // Guard against duplicates and compute a string so we can do
      // constant time lookups to compare against existing symbols
      const flag = computeImportedSymbolFlag(importedSymbol);
      if (requiredImportedSymbolSetFlags.has(flag)) return;
      requiredImportedSymbolSetFlags.add(flag);

      requiredImportedSymbolSet.add(importedSymbol);
    },

    continuation: (node) =>
      visitNode({
        ...visitorOptions,
        sourceFile,
        node,
      }),
    childContinuation: (node) =>
      context.typescript.visitEachChild(
        node,
        (cbNode) =>
          visitNode({
            ...visitorOptions,
            sourceFile,
            node: cbNode,
          }),
        context.transformationContext
      ),
  };

  return visitorOptions.continuation(sourceFile) as TS.SourceFile;
}
