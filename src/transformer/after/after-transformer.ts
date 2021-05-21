import { BaseVisitorContext, VisitorContext } from "../visitor-context";
import { TS } from "../../type/type";
import { AfterVisitorOptions } from "./after-visitor-options";
import { visitNode } from "./visitor/visit-node";
import {
  getDefineArrayLiteralExpression,
  getRootBlock,
} from "../../util/ts-util";

type SourceFileWithEmitNodes = TS.SourceFile & {
  emitNode?: {
    helpers?: TS.EmitHelper[];
  };
};

export function afterTransformer(
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
  sourceFile: SourceFileWithEmitNodes,
  context: VisitorContext
): TS.SourceFile {
  // For TypeScript versions below 3.5, there may be instances
  // where EmitHelpers such as __importDefault or __importStar is duplicated.
  // For these TypeScript versions, well have to guard against this behavior
  if (sourceFile.emitNode != null && sourceFile.emitNode.helpers != null) {
    const seenNames = new Set();
    const filtered = sourceFile.emitNode.helpers.filter((helper) => {
      if (seenNames.has(helper.name)) return false;
      seenNames.add(helper.name);
      return true;
    });

    // Reassign the emitNodes if they changed
    if (filtered.length !== sourceFile.emitNode.helpers.length) {
      sourceFile.emitNode.helpers = filtered;
    }
  }

  const visitorOptions: Omit<
    AfterVisitorOptions<TS.Node>,
    "node" | "sourceFile"
  > = {
    context,
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
        context.transformationContext
      ),
  };

  return visitorOptions.continuation(sourceFile) as TS.SourceFile;
}
