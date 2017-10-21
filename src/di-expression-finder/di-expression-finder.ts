import {ICodeAnalyzer, PropertyAccessCallExpression} from "@wessberg/codeanalyzer";
import {IDIConfig} from "../di-config/i-di-config";
import {IDIExpressionFinder} from "./i-di-expression-finder";
import {IDIExpressionFinderFindOptions} from "./i-di-expression-finder-find-options";
import {IDIExpressionFinderFindResult} from "./i-di-expression-finder-find-result";
import {DIExpression} from "../di-expression/i-di-expression";
import {DIExpressionKind} from "../di-expression/di-expression-kind";
import {IDIExpressionFinderConstructorArgumentsResult} from "./i-di-expression-finder-constructor-arguments-result";
import {ClassDeclaration, ClassExpression, ConstructorDeclaration, isClassDeclaration, SourceFile} from "typescript";

/**
 * A class that can find all IDIExpressions in a file
 */
export class DIExpressionFinder implements IDIExpressionFinder {
	constructor (private host: ICodeAnalyzer,
							 private diConfig: IDIConfig) {
	}

	/**
	 * Finds all DIContainer expressions and returns them
	 * @param {SourceFile} sourceFile
	 * @returns {IDIExpressionFinderFindResult}
	 */
	public find ({sourceFile}: IDIExpressionFinderFindOptions): IDIExpressionFinderFindResult {
		const expressions: DIExpression[] = [];
		this.host.callExpressionService.getCallExpressionsOnPropertyAccessExpressionMatching(this.diConfig.serviceContainerName, undefined, sourceFile, true)
			.forEach(expression => expressions.push(this.getDIExpression(expression, sourceFile)));
		return {expressions};
	}

	/**
	 * Gets a DIExpression, depending on the kind of call expression
	 * @param {PropertyAccessCallExpression} expression
	 * @param {SourceFile} sourceFile
	 * @returns {DIExpression}
	 */
	private getDIExpression (expression: PropertyAccessCallExpression, sourceFile: SourceFile): DIExpression {
		const kind = this.getDIExpressionKind(expression);

		// Take the type arguments of the CallExpression
		const [typeName, implementationName] = this.host.callExpressionService.getTypeArgumentNames(expression);

		// Take the fileName from the SourceFile
		const file = sourceFile.fileName;

		switch (kind) {
			case DIExpressionKind.GET:
				return {
					expression,
					typeName,
					file,
					kind: DIExpressionKind.GET
				};
			case DIExpressionKind.HAS:
				return {
					expression,
					typeName,
					file,
					kind: DIExpressionKind.HAS
				};
			case DIExpressionKind.REGISTER_TRANSIENT:
			case DIExpressionKind.REGISTER_SINGLETON:
				const {constructorArguments, serviceFile} = this.getConstructorArguments(implementationName, sourceFile);
				const base = {
					expression,
					file,
					kind: DIExpressionKind.REGISTER_TRANSIENT,
					constructorArguments,
					typeName,
					implementationName,
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
	 * Gets the DIExpressionKind for the property of a PropertyAccessCallExpression
	 * @param {PropertyAccessCallExpression} expression
	 * @returns {DIExpressionKind}
	 */
	private getDIExpressionKind ({expression}: PropertyAccessCallExpression): DIExpressionKind {
		const propertyName = this.host.propertyAccessExpressionService.getPropertyName(expression);
		switch (propertyName) {
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
	 * @param {string} implementationName
	 * @param {SourceFile} sourceFile
	 * @returns {IDIExpressionFinderConstructorArgumentsResult}
	 */
	private getConstructorArguments (implementationName: string, sourceFile: SourceFile): IDIExpressionFinderConstructorArgumentsResult {

		// Find the matching class declaration
		const classDeclaration = this.host.resolver.resolve(implementationName, sourceFile);

		// If no class were matched or if the matched node isn't a class, return an empty array of constructor arguments
		if (classDeclaration == null || !isClassDeclaration(classDeclaration)) {
			return {
				constructorArguments: [],
				serviceFile: null
			};
		}

		// Check if it has or inherits a constructor
		const constructor = this.getConstructor(classDeclaration);

		// If it has none, return an empty array of arguments and no serviceFile
		if (constructor == null) {
			return {
				constructorArguments: [],
				serviceFile: null
			};
		}

		// Otherwise, take all of the type names of the constructor (that isn't initialized to any value, otherwise we respect it)
		return {
			constructorArguments: this.host.constructorService.getNonInitializedTypeNames(constructor),
			serviceFile: constructor.getSourceFile().fileName
		};
	}

	/**
	 * Returns the constructor of a class. May resolve it through the inheritance chain
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ConstructorDeclaration|null}
	 */
	private getConstructor (classDeclaration: ClassDeclaration|ClassExpression): ConstructorDeclaration|null {
		const constructor = this.host.classService.getConstructor(classDeclaration);

		// If it has a constructor, return it immediately.
		if (constructor != null) return constructor;

		// Return an empty object if the formatted class doesn't extend anything that may have a constructor
		if (this.host.classService.isBaseClass(classDeclaration)) return null;

		// Otherwise, resolve the parent
		const resolvedParent = this.host.classService.resolveExtendedClass(classDeclaration);

		// If a parent could not be resolved, assume that the parent is a built-in (such as Error)
		if (resolvedParent == null) {
			return null;
		}

		// Otherwise, go up the inheritance chain recursively to find the constructor
		return this.getConstructor(resolvedParent);
	}

}