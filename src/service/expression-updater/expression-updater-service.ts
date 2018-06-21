import {IExpressionUpdaterService} from "./i-expression-updater-service";
import {IExpressionUpdaterServiceUpdateOptions} from "./i-expression-updater-service-update-options";
import {IContainerService} from "../container/i-container-service";
import {DIExpression, IDIExpression, IDIRegisterExpression} from "../../di-expression/i-di-expression";
import {DIExpressionKind} from "../../di-expression/di-expression-kind";

/**
 * A class that can mutate all DIExpressions
 */
export class ExpressionUpdaterService implements IExpressionUpdaterService {
	/**
	 * Updates all of the provided expressions
	 * @param {DIExpression[]} expressions
	 * @param {IContainerService} codeContainer
	 */
	public update ({expressions, container}: IExpressionUpdaterServiceUpdateOptions): void {
		expressions.forEach(diExpression => this.updateExpression(container, diExpression));
	}

	/**
	 * Updates the given DIExpression
	 * @param {IContainerService} container
	 * @param {DIExpression} diExpression
	 */
	private updateExpression (container: IContainerService, diExpression: DIExpression): void {
		// Don't update already compiled expressions
		if (diExpression.precompiled) return;

		switch (diExpression.kind) {
			case DIExpressionKind.HAS:
				return this.updateHasExpression(container, diExpression);
			case DIExpressionKind.GET:
				return this.updateGetExpression(container, diExpression);
			case DIExpressionKind.REGISTER_TRANSIENT:
				return this.updateRegisterTransientExpression(container, diExpression);
			case DIExpressionKind.REGISTER_SINGLETON:
				return this.updateRegisterSingletonExpression(container, diExpression);
		}
	}

	/**
	 * Updates a 'registerSingleton' expression
	 * @param {IContainerService} container
	 * @param {IDIRegisterExpression} expression
	 */
	private updateRegisterSingletonExpression (container: IContainerService, expression: IDIRegisterExpression): void {
		return this.updateRegisterTransientExpression(container, expression);
	}

	/**
	 * Updates a 'registerTransient' expression
	 * @param {IContainerService} container
	 * @param {PropertyAccessCallExpression} expression
	 * @param {Iterable<string?>} constructorArguments
	 * @param {string} typeName
	 * @param {string} implementationName
	 */
	private updateRegisterTransientExpression (container: IContainerService, {expression, typeName, implementationName, constructorArguments}: IDIRegisterExpression): void {

		// If an argument is given to the call expression, it serves as a custom constructor
		const hasCustomConstructor = expression.arguments.length >= 1;

		const typeStringified = `"${typeName}"`;
		const implementationStringified = hasCustomConstructor ? "null" : implementationName;
		const constructorArgumentsStringified = hasCustomConstructor ? "null" : `[${[...constructorArguments].map(item => item == null ? `${item}` : `"${item}"`).join(", ")}]`;

		// The options to pass as a second argument
		const stringifiedOptions = `{identifier: ${typeStringified}, implementation: ${implementationStringified}, constructorArguments: ${constructorArgumentsStringified}}`;

		// If no arguments has been given, pass in "undefined" as the first argument before providing the options object":
		if (expression.arguments.length < 1) {
			container.appendLeft(
				expression.arguments.pos,
				`undefined, ${stringifiedOptions}`
			);
		}

		else {
			// If a custom function to return a new instance of the service has been provided, place the options object as the second argument.
			container.appendLeft(
				expression.arguments[0].end,
				`, ${stringifiedOptions}`
			);
		}
	}

	/**
	 * Updates a 'has' expression
	 * @param {IContainerService} container
	 * @param {IDIHasExpression} expression
	 */
	private updateHasExpression (container: IContainerService, expression: IDIExpression): void {
		return this.updateGetExpression(container, expression);
	}

	/**
	 * Updates a 'get' expression
	 * @param {IContainerService} container
	 * @param {PropertyAccessCallExpression} expression
	 * @param {string} typeName
	 */
	private updateGetExpression (container: IContainerService, {expression, typeName}: IDIExpression): void {

		// Append it as the first argument
		container.appendLeft(
			expression.arguments.pos,
			`{identifier: "${typeName}"}`
		);
	}

}