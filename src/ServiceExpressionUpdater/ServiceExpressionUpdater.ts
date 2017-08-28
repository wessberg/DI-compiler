import {ICompilerResult} from "../Compiler/Interface/ICompiler";
import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {IGetOptions} from "@wessberg/di";
import {IMappedInterfaceToImplementationMap, IServiceExpressionUpdater, IServiceExpressionUpdaterRegisterExpressionHandlerOptions, IServiceExpressionUpdaterUpdateMethodOptions} from "./Interface/IServiceExpressionUpdater";
import {ITypeDetector} from "@wessberg/typedetector";
import {IFormattedCallExpression, isFormattedPropertyAccessExpression} from "@wessberg/type";

/**
 * Walks through all call expressions on the DIContainer instance and upgrades their arguments.
 * @author Frederik Wessberg
 */
export class ServiceExpressionUpdater implements IServiceExpressionUpdater {

	constructor (private config: IDIConfig,
							 private typeDetector: ITypeDetector) {
	}

	/**
	 * Walks through all expressions and delegates the update work to other methods in order to upgrade the code.
	 * @param {ICompilerResult} codeContainer
	 * @param {IFormattedPropertyAccessExpression[]} expressions
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 */
	public update ({codeContainer, expressions, mappedInterfaces}: IServiceExpressionUpdaterUpdateMethodOptions): IMappedInterfaceToImplementationMap {

		expressions.forEach(expression => {
			// Only property access expressions are supported
			if (!isFormattedPropertyAccessExpression(expression.expression)) return;
			if (expression.expression.property === this.config.registerTransientName || expression.expression.property === this.config.registerSingletonName) {
				Object.assign(mappedInterfaces, this.handleRegisterExpression({codeContainer, expression}));
			}

			if (expression.expression.property === this.config.getName || expression.expression.property === this.config.hasName) {
				this.handleGetExpression(codeContainer, expression);
			}
		});

		return mappedInterfaces;
	}

	/**
	 * Handles all expressions where services are registered (like registerTransient and registerSingleton)
	 * @param {ICompilerResult} codeContainer
	 * @param {IFormattedCallExpression} expression
	 */
	private handleRegisterExpression ({codeContainer, expression}: IServiceExpressionUpdaterRegisterExpressionHandlerOptions): IMappedInterfaceToImplementationMap {
		if (expression.typeArguments.length === 0) throw new TypeError(`${this.handleRegisterExpression.name} could not handle a register expression: No generic type arguments were given!`);
		const [identifier, implementation] = expression.typeArguments;

		const config = {
			// The identifier for the service will be the first generic argument - the interface.
			identifier: `"${identifier.toString()}"`,
			// If a custom constructor has been given, pass 'null' as the name of the implementation.
			implementation: expression.arguments.arguments.length < 1 ? implementation.toString() : null
		};

		// If no arguments has been given, pass in "undefined" as the first argument before providing the options object":
		if (expression.arguments.arguments.length < 1) {
			codeContainer.code.appendLeft(
				expression.arguments.startsAt,
				`undefined, ${this.stringifyObject(config)}`
			);
		} else {
			// If a custom function to return a new instance of the service has been provided, place the options object as the second argument.
			codeContainer.code.appendLeft(
				expression.arguments.arguments[0].endsAt,
				`, ${this.stringifyObject(config)}`
			);
		}
		codeContainer.hasAltered = true;
		return {[identifier.toString()]: implementation.toString()};
	}

	/**
	 * Handles all expressions where services are retrieved (like get)
	 * @param {ICompilerResult} codeContainer
	 * @param {IFormattedCallExpression} expression
	 */
	private handleGetExpression (codeContainer: ICompilerResult, expression: IFormattedCallExpression): void {
		if (expression.typeArguments.length === 0) return;
		const [typeArgument] = expression.typeArguments;
		const config: IGetOptions = {
			identifier: `"${typeArgument.toString()}"`
		};

		codeContainer.code.appendLeft(
			expression.arguments.startsAt,
			this.stringifyObject(config)
		);
		codeContainer.hasAltered = true;
	}

	/**
	 * A specialized stringifier that makes sure to pass in the constructor directly.
	 * @param {{}} item
	 * @returns {string}
	 */
	private stringifyObject (item: {}): string {
		let str = "";
		if (this.typeDetector.isObject(item)) {
			str += "{";
			const keys = Object.keys(item);
			keys.forEach((key, index) => {
				str += `${key}: ${this.stringifyObject(<{}>item[key])}`;
				if (index !== keys.length - 1) str += ", ";
			});
			str += "}";
		} else str += `${item}`;
		return str;
	}

}