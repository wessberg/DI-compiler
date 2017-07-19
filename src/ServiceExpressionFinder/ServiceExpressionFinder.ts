import {IServiceExpressionFinder, IServiceExpressionFinderFindMethodOptions} from "./Interface/IServiceExpressionFinder";
import {ICallExpression} from "@wessberg/codeanalyzer";

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
	 * @returns {ICallExpression[]}
	 */
	public find ({host, statements, identifiers, filepath}: IServiceExpressionFinderFindMethodOptions): ICallExpression[] {
		const expressions = host.getCallExpressions(statements, true);
		return expressions.filter(exp => {
			if (exp.property == null || !identifiers.has(exp.property.toString())) return false;
			this.assertNoArguments(exp, filepath);
			return true;
		});
	}

	/**
	 * Asserts that no arguments are given to the provided expression.
	 * @param {ICallExpression} expression
	 * @param {string} filepath
	 * @returns {void}
	 */
	private assertNoArguments (expression: ICallExpression, filepath: string): void {
		if (expression.arguments.argumentsList.length === 0) return;
		const formattedExpression = `${expression.property}.${expression.identifier}<${expression.type.flattened}>(${expression.arguments.argumentsList.map(arg => arg.value.hasDoneFirstResolve() ? arg.value.resolved : arg.value.resolve()).join(", ")})`;

		if (expression.type.bindings == null || expression.type.bindings.length < 2) {
			throw new TypeError(`Found an issue in ${filepath}: You must pass an implementation as the second generic type parameter here: ${formattedExpression}`);
		}

		if (expression.arguments.argumentsList.length > 1) {
			throw new TypeError(`Found an issue in ${filepath}: You shouldn't pass a second argument around here: ${formattedExpression}. Instead, let the compiler do it for you.`);
		}
	}

}