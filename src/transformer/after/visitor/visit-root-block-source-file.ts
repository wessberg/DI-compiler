import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";
import { visitRootBlock } from "./visit-root-block";
import { updateSourceFile } from "../../../util/ts-util";

export function visitRootBlockSourceFile(
  options: AfterVisitorOptions<TS.SourceFile>
): TS.VisitResult<TS.Node> {
  const { node, context } = options;

  return updateSourceFile(
    context,
    node,
    visitRootBlock(options),
    node.isDeclarationFile,
    node.referencedFiles,
    node.typeReferenceDirectives,
    node.hasNoDefaultLib,
    node.libReferenceDirectives
  );
}
