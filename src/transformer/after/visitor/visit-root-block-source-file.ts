import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";
import { visitRootBlock } from "./visit-root-block";

export function visitRootBlockSourceFile(
  options: AfterVisitorOptions<TS.SourceFile>
): TS.VisitResult<TS.Node> {
  const { node, context } = options;
  const { factory } = context;

  return factory.updateSourceFile(
    node,
    visitRootBlock(options),
    node.isDeclarationFile,
    node.referencedFiles,
    node.typeReferenceDirectives,
    node.hasNoDefaultLib,
    node.libReferenceDirectives
  );
}
