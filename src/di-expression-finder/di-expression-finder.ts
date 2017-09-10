import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IDIConfig} from "../di-config/i-di-config";
import {IDIExpressionFinder} from "./i-di-expression-finder";
import {IDIExpressionFinderFindOptions} from "./i-di-expression-finder-find-options";
import {IDIExpressionFinderFindResult} from "./i-di-expression-finder-find-result";
import {FormattedExpression, IFormattedCallExpression, IFormattedPropertyAccessExpression, isFormattedClass, isFormattedIdentifier, isFormattedPropertyAccessExpression} from "@wessberg/type";
import {DIExpression} from "../di-expression/i-di-expression";
import {DIExpressionKind} from "../di-expression/di-expression-kind";
import {IDIExpressionFinderConstructorArgumentsResult} from "./i-di-expression-finder-constructor-arguments-result";

/**
 * A class that can find all IDIExpressions in a file
 */
export class DIExpressionFinder implements IDIExpressionFinder {
	constructor (private host: ICodeAnalyzer,
							 private diConfig: IDIConfig) {
	}

	/**
	 * Finds all DIContainer expressions and returns them
	 * @param {string} file
	 * @returns {IDIExpressionFinderFindResult}
	 */
	public find ({file}: IDIExpressionFinderFindOptions): IDIExpressionFinderFindResult {
		const expressions: DIExpression[] = [];
		this.host.findMatchingCallExpressionsForFile(file, this.diConfig.serviceContainerName)
			.forEach(expression => {
				// We only support call expressions for now
				if (!isFormattedPropertyAccessExpression(expression.expression)) return;

				// We only support property access expressions where the left-hand expression is an identifier for now
				if (!isFormattedIdentifier(expression.expression.expression)) return;
				// Make sure that the name of the expression is equals the name of the service container
				if (expression.expression.expression.name !== this.diConfig.serviceContainerName) return;

				expressions.push(this.getDIExpression(expression.expression, expression));
			});
		return {expressions};
	}

	/**
	 * Gets a DIExpression, depending on the kind of call expression
	 * @param {IFormattedPropertyAccessExpression} propertyAccess
	 * @param {IFormattedCallExpression} expression
	 * @returns {DIExpression}
	 */
	private getDIExpression (propertyAccess: IFormattedPropertyAccessExpression, expression: IFormattedCallExpression): DIExpression {
		const kind = this.getDIExpressionKind(propertyAccess);
		switch (kind) {
			case DIExpressionKind.GET:
				return {
					expression,
					kind: DIExpressionKind.GET
				};
			case DIExpressionKind.HAS:
				return {
					expression,
					kind: DIExpressionKind.HAS
				};
			case DIExpressionKind.REGISTER_TRANSIENT:
			case DIExpressionKind.REGISTER_SINGLETON:
				const {constructorArguments, serviceFile} = this.getConstructorArgumentsForTypeArgument(expression.typeArguments[1]);
				const base = {
					expression,
					file: expression.file,
					kind: DIExpressionKind.REGISTER_TRANSIENT,
					constructorArguments,
					serviceFile
				};
				if (kind === DIExpressionKind.REGISTER_TRANSIENT) {
					return {
						...base,
						kind: DIExpressionKind.REGISTER_TRANSIENT
					};
				} else {
					return {
						...base,
						kind: DIExpressionKind.REGISTER_SINGLETON
					};
				}
		}
	}

	/**
	 * Gets the DIExpressionKind for the property of a PropertyAccessExpression
	 * @param {} expression
	 * @returns {DIExpressionKind}
	 */
	private getDIExpressionKind (expression: IFormattedPropertyAccessExpression): DIExpressionKind {
		switch (expression.property) {
			case this.diConfig.registerSingletonName:
				return DIExpressionKind.REGISTER_SINGLETON;
			case this.diConfig.registerTransientName:
				return DIExpressionKind.REGISTER_TRANSIENT;
			case this.diConfig.hasName:
				return DIExpressionKind.HAS;
			default:
				return DIExpressionKind.GET;
		}
	}

	/**
	 * Gets all constructor arguments that matches the class that the TypeArgument refers to
	 * @param {FormattedExpression} typeArgument
	 * @returns {IDIExpressionFinderConstructorArgumentsResult}
	 */
	private getConstructorArgumentsForTypeArgument (typeArgument: FormattedExpression): IDIExpressionFinderConstructorArgumentsResult {
		const constructorArguments: (string|undefined)[] = [];

		// Find the matching class declaration
		const classDeclaration = this.host.getDefinitionMatchingExpression(typeArgument);

		// If the definition is indeed a class and it has a constructor
		if (classDeclaration != null && isFormattedClass(classDeclaration) && classDeclaration.constructor != null) {
			classDeclaration.constructor.parameters.forEach(parameter => {
				// If the constructor argument has an initializer, respect it
				if (parameter.initializer != null) constructorArguments.push(undefined);
				// Otherwise, add the name of the constructor type as a dependency injected service
				else constructorArguments.push(parameter.type.toString());
			});
		}

		return {
			constructorArguments,
			serviceFile: classDeclaration == null ? null : classDeclaration.file
		};
	}

}