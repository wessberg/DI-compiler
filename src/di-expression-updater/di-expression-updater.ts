import {IDIExpressionUpdater} from "./i-di-expression-updater";
import {IDIExpressionUpdaterUpdateOptions} from "./i-di-expression-updater-update-options";
import {DIExpression, IDIExpression, IDIRegisterExpression} from "../di-expression/i-di-expression";
import {DIExpressionKind} from "../di-expression/di-expression-kind";
import {ICodeContainer} from "../code-container/i-code-container";

/**
 * A class that can mutate all DIExpressions
 */
export class DIExpressionUpdater implements IDIExpressionUpdater {
	/**
	 * Updates all of the provided expressions
	 * @param {DIExpression[]} expressions
	 * @param {ICodeContainer} codeContainer
	 */
	public update ({expressions, codeContainer}: IDIExpressionUpdaterUpdateOptions): void {
		expressions.forEach(diExpression => this.updateExpression(codeContainer, diExpression));
	}

	/**
	 * Updates the given DIExpression
	 * @param {ICodeContainer} codeContainer
	 * @param {DIExpression} diExpression
	 */
	private updateExpression (codeContainer: ICodeContainer, diExpression: DIExpression): void {
		switch (diExpression.kind) {
			case DIExpressionKind.HAS:
				return this.updateHasExpression(codeContainer, diExpression);
			case DIExpressionKind.GET:
				return this.updateGetExpression(codeContainer, diExpression);
			case DIExpressionKind.REGISTER_TRANSIENT:
				return this.updateRegisterTransientExpression(codeContainer, diExpression);
			case DIExpressionKind.REGISTER_SINGLETON:
				return this.updateRegisterSingletonExpression(codeContainer, diExpression);
		}
	}

	/**
	 * Updates a 'registerSingleton' expression
	 * @param {ICodeContainer} codeContainer
	 * @param {IDIRegisterExpression} expression
	 */
	private updateRegisterSingletonExpression (codeContainer: ICodeContainer, expression: IDIRegisterExpression): void {
		return this.updateRegisterTransientExpression(codeContainer, expression);
	}

	/**
	 * Updates a 'registerTransient' expression
	 * @param {ICodeContainer} codeContainer
	 * @param {PropertyAccessCallExpression} expression
	 * @param {Iterable<string?>} constructorArguments
	 * @param {string} typeName
	 * @param {string} implementationName
	 */
	private updateRegisterTransientExpression (codeContainer: ICodeContainer, {expression, constructorArguments, typeName, implementationName}: IDIRegisterExpression): void {

		// If an argument is given to the call expression, it serves as a custom constructor
		const hasCustomConstructor = expression.arguments.length >= 1;

		const typeStringified = `"${typeName}"`;
		const implementationStringified = hasCustomConstructor ? "null" : implementationName;
		const constructorArgumentsStringified = hasCustomConstructor ? "null" : `[${[...constructorArguments].map(item => item == null ? `${item}` : `"${item}"`).join(", ")}]`;

		// The options to pass as a second argument
		const stringifiedOptions = `{identifier: ${typeStringified}, implementation: ${implementationStringified}, constructorArguments: ${constructorArgumentsStringified}}`;

		// If no arguments has been given, pass in "undefined" as the first argument before providing the options object":
		if (expression.arguments.length < 1) {
			codeContainer.append(
				`undefined, ${stringifiedOptions}`,
				expression.arguments.pos
			);
		}

		else {
			// If a custom function to return a new instance of the service has been provided, place the options object as the second argument.
			codeContainer.append(
				`, ${stringifiedOptions}`,
				expression.arguments[0].end
			);
		}
	}

	/**
	 * Updates a 'has' expression
	 * @param {ICodeContainer} codeContainer
	 * @param {IDIHasExpression} expression
	 */
	private updateHasExpression (codeContainer: ICodeContainer, expression: IDIExpression): void {
		return this.updateGetExpression(codeContainer, expression);
	}

	/**
	 * Updates a 'get' expression
	 * @param {ICodeContainer} codeContainer
	 * @param {PropertyAccessCallExpression} expression
	 * @param {string} typeName
	 */
	private updateGetExpression (codeContainer: ICodeContainer, {expression, typeName}: IDIExpression): void {

		// Append it as the first argument
		codeContainer.append(
			`{identifier: "${typeName}"}`,
			expression.arguments.pos
		);
	}

}