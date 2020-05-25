import { VisitorContext } from "../visitor-context";
import { TS } from "../../type/type";
import { BeforeVisitorOptions } from "./before-visitor-options";
import { visitNode } from "./visitor/visit-node";

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
  const trailingStatements: TS.Statement[] = [];

  const visitorOptions: Pick<
    BeforeVisitorOptions<TS.Node>,
    Exclude<keyof BeforeVisitorOptions<TS.Node>, "node" | "sourceFile">
  > = {
    context,

    addTrailingStatements: (...statements: TS.Statement[]): void => {
      trailingStatements.push(...statements);
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

  const updatedSourceFile = visitorOptions.continuation(
    sourceFile
  ) as TS.SourceFile;
  if (trailingStatements.length < 1) return updatedSourceFile;

  return context.typescript.updateSourceFileNode(
    updatedSourceFile,
    [...updatedSourceFile.statements, ...trailingStatements],
    sourceFile.isDeclarationFile,
    sourceFile.referencedFiles,
    sourceFile.typeReferenceDirectives,
    sourceFile.hasNoDefaultLib,
    sourceFile.libReferenceDirectives
  );
}
