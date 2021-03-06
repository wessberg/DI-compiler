import { TS } from "../../type/type";
import { VisitorContext } from "../visitor-context";

/**
 * A TypeNode such as IFoo<string> should still yield the service name "IFoo".
 * This helper generates a proper service name from a TypeNode
 */
export function pickServiceOrImplementationName(
  node: TS.Expression | TS.TypeNode | TS.EntityName,
  context: VisitorContext
): string {
  const { typescript } = context;

  if (typescript.isTypeReferenceNode(node)) {
    return pickServiceOrImplementationName(node.typeName, context);
  } else if (typescript.isIndexedAccessTypeNode(node)) {
    return `${pickServiceOrImplementationName(
      node.objectType,
      context
    )}[${pickServiceOrImplementationName(node.indexType, context)}]`;
  } else {
    return node.getFullText().trim();
  }
}
