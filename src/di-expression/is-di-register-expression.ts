import {IDIExpression, IDIRegisterExpression} from "./i-di-expression";
import {DIExpressionKind} from "./di-expression-kind";

/**
 * Returns true if the given expression is an IDIRegisterExpression
 * @param {IDIExpression} item
 * @returns {boolean}
 */
export function isDIRegisterExpression (item: IDIExpression): item is IDIRegisterExpression {
	return item != null && (item.kind === DIExpressionKind.REGISTER_SINGLETON || item.kind === DIExpressionKind.REGISTER_TRANSIENT);
}