import {IServiceExpressionFinder, IServiceExpressionFinderFindMethodOptions} from "./Interface/IServiceExpressionFinder";
import {IFormattedCallExpression, isFormattedIdentifier, isFormattedPropertyAccessExpression} from "@wessberg/type";
import {diConfig} from "../DIConfig/DIConfig";

/**
 * Finds all expressions in the given statements related to the DIContainer.
 * @author Frederik Wessberg
 */
export class ServiceExpressionFinder implements IServiceExpressionFinder {

	/**
	 * Traverses the AST and extracts all CallExpressions that has to do with the DIContainer.
	 * @param host
	 * @param statements
	 * @param {Set<string>} identifiers
	 * @param {string} filepath
	 * @returns {IFormattedCallExpression[]}
	 */
	public find ({host, identifiers, filepath}: IServiceExpressionFinderFindMethodOptions): IFormattedCallExpression[] {
		const expressions = host.findMatchingCallExpressionsForFile(filepath, diConfig.exportName);
		return expressions.filter(exp => {
			// We only support call expressions for now
			if (!isFormattedPropertyAccessExpression(exp.expression)) return;
			// We only support property access expressions where the left-hand expression is an identifier for now

			if (!isFormattedIdentifier(exp.expression.expression)) return;
			if (exp.expression.expression.name == null || !identifiers.has(exp.expression.expression.name)) return false;
			this.assertNoArguments(exp, filepath);
			return true;
		});
	}

	/**
	 * Asserts that no arguments are given to the provided expression.
	 * @param {IFormattedCallExpression} expression
	 * @param {string} filepath
	 * @returns {void}
	 */
	private assertNoArguments (expression: IFormattedCallExpression, filepath: string): void {
		if (expression.arguments.arguments.length === 0) return;

		if (expression.typeArguments.length === 0 || expression.typeArguments.length < 2) {
			throw new TypeError(`Found an issue in ${filepath}: You must pass an implementation as the second generic type parameter here: ${expression.toString()}`);
		}

		if (expression.arguments.arguments.length > 1) {
			throw new TypeError(`Found an issue in ${filepath}: You shouldn't pass a second argument around here: ${expression.toString()}. Instead, let the compiler do it for you.`);
		}
	}

}