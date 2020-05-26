import { VisitorContext } from "../visitor-context";
import { TS } from "../../type/type";
import { AfterVisitorOptions } from "./after-visitor-options";
import { visitNode } from "./visitor/visit-node";
import {
  getDefineArrayLiteralExpression,
  getRootBlock,
} from "../../util/ts-util";

export function afterTransformer(
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
  const visitorOptions: Pick<
    AfterVisitorOptions<TS.Node>,
    Exclude<keyof AfterVisitorOptions<TS.Node>, "node" | "sourceFile">
  > = {
    context,
    transformationContext,
    defineArrayLiteralExpression: getDefineArrayLiteralExpression(
      sourceFile,
      context
    ),
    rootBlock: getRootBlock(sourceFile, context),

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
