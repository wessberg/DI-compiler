import { VisitorContext } from "../visitor-context";
import { TS } from "../../type/type";
import { BeforeVisitorOptions } from "./before-visitor-options";
import { visitNode } from "./visitor/visit-node";
import { ImportedSymbol } from "../../type/imported-symbol";

export function beforeTransformer(
  context: VisitorContext
): TS.TransformerFactory<TS.SourceFile> {
  return (transformationContext) => (sourceFile) =>
    transformSourceFile(sourceFile, context, transformationContext);
}

function transformSourceFile(
  sourceFile: TS.SourceFile,
  context: VisitorContext,
  transformationContext: TS.TransformationContext
): TS.SourceFile {
  const requiredImportedSymbolSet = new Set<ImportedSymbol>();

  context.sourceFileToAddTslibDefinition.set(sourceFile.fileName, false);
  context.sourceFileToRequiredImportedSymbolSet.set(
    sourceFile.fileName,
    requiredImportedSymbolSet
  );

  const visitorOptions: Pick<
    BeforeVisitorOptions<TS.Node>,
    Exclude<keyof BeforeVisitorOptions<TS.Node>, "node" | "sourceFile">
  > = {
    context,
    transformationContext,

    addTslibDefinition: (): void => {
      context.sourceFileToAddTslibDefinition.set(sourceFile.fileName, true);
    },

    requireImportedSymbol: (importedSymbol: ImportedSymbol): void => {
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
        transformationContext
      ),
  };

  return visitorOptions.continuation(sourceFile) as TS.SourceFile;
}
