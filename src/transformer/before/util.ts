/* eslint-disable deprecation/deprecation */
import type {TS} from "../../type/type.js";
import type {VisitorContext} from "../visitor-context.js";

/**
 * A TypeNode such as IFoo<string> should still yield the service name "IFoo".
 * This helper generates a proper service name from a TypeNode
 */
export function pickServiceOrImplementationName(node: TS.Expression | TS.TypeNode | TS.EntityName, context: VisitorContext): string {
	const {typescript} = context;

	if (typescript.isTypeReferenceNode(node)) {
		return pickServiceOrImplementationName(node.typeName, context);
	} else if (typescript.isIndexedAccessTypeNode(node)) {
		return `${pickServiceOrImplementationName(node.objectType, context)}[${pickServiceOrImplementationName(node.indexType, context)}]`;
	} else {
		return node.getText().trim();
	}
}

export function getModifierLikes(node: TS.Node): readonly TS.ModifierLike[] | undefined {
	if ("decorators" in node && Array.isArray(node.decorators)) {
		return [...(node.decorators ?? []), ...(node.modifiers ?? [])];
	} else {
		return node.modifiers;
	}
}
