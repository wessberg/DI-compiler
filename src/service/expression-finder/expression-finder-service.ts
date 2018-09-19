import {ICodeAnalyzer, PropertyAccessCallExpression} from "@wessberg/codeanalyzer";
import {IExpressionFinderService} from "./i-expression-finder-service";
import {IExpressionFinderServiceFindOptions} from "./i-expression-finder-service-find-options";
import {IExpressionFinderServiceFindResult} from "./i-expression-finder-service-find-result";
import {IDIConfig} from "../../di-config/i-di-config";
import {DIExpression} from "../../di-expression/i-di-expression";
import {DIExpressionKind} from "../../di-expression/di-expression-kind";
import {ClassDeclaration, ClassExpression, ConstructorDeclaration, isClassDeclaration, SourceFile} from "typescript";

/**
 * A class that can find all DIExpressions in a file
 */
export class ExpressionFinderService implements IExpressionFinderService {
	/**
	 * A regular expression that matches compiled identifiers
	 * @type {RegExp}
	 */
	private readonly COMPILED_IDENTIFIER_REGEX = /identifier:\s*"([^"]*)"/;

	/**
	 * A regular expression that matches compiled implementations
	 * @type {RegExp}
	 */
	private readonly COMPILED_IMPLEMENTATION_REGEX = /implementation:\s*([^, ;}]*)/;

	constructor (private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly diConfig: IDIConfig) {
	}

	/**
	 * Finds all DIContainer expressions and returns them
	 * @param {SourceFile} sourceFile
	 * @returns {IExpressionFinderServiceFindResult}
	 */
	public find ({sourceFile}: IExpressionFinderServiceFindOptions): IExpressionFinderServiceFindResult {
		const expressions: DIExpression[] = [];
		this.codeAnalyzer.callExpressionService.getCallExpressionsOnPropertyAccessExpressionMatching(this.diConfig.serviceContainerName, undefined, sourceFile, true)
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
		let precompiled: boolean = false;

		// Take the type arguments of the CallExpression
		let [typeName, implementationName] = this.codeAnalyzer.callExpressionService.getTypeArgumentNames(expression);

		// If no typeName could be detected, the expression may already be compiled.
		// If that is the case, take the names of the arguments
		if (typeName == null) {
			precompiled = true;
			const args = [...this.codeAnalyzer.callExpressionService.getArguments(expression)];
			switch (kind) {
				case DIExpressionKind.GET:
				case DIExpressionKind.HAS:
					// The identifier will be given as the first argument.
					typeName = args[0].match(this.COMPILED_IDENTIFIER_REGEX)![1];
					break;

				case DIExpressionKind.REGISTER_SINGLETON:
				case DIExpressionKind.REGISTER_TRANSIENT:
					// The type name will be given in the second argument all times, potentially also the implementation
					// The identifier will be given as the first argument.
					typeName = args[1].match(this.COMPILED_IDENTIFIER_REGEX)![1];
					implementationName = args[1].match(this.COMPILED_IMPLEMENTATION_REGEX)![1];

					// If the implementation is still null, the implementation is overridden or provided in a callback as the first argument
					if (implementationName == null || implementationName === "null") {
						// Assign to the implementation the name of the type
						implementationName = typeName;
					}
					break;
			}

		}

		// Take the fileName from the SourceFile
		const file = sourceFile.fileName;

		switch (kind) {
			case DIExpressionKind.GET:
				return {
					expression,
					typeName,
					precompiled,
					file,
					kind: DIExpressionKind.GET
				};
			case DIExpressionKind.HAS:
				return {
					expression,
					typeName,
					precompiled,
					file,
					kind: DIExpressionKind.HAS
				};
			case DIExpressionKind.REGISTER_TRANSIENT:
			case DIExpressionKind.REGISTER_SINGLETON:
				const base = {
					precompiled,
					expression,
					constructorArguments: this.getConstructorArguments(implementationName, sourceFile),
					file,
					kind: DIExpressionKind.REGISTER_TRANSIENT,
					typeName,
					implementationName
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
		const propertyName = this.codeAnalyzer.propertyAccessExpressionService.getPropertyName(expression);
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
	 * @returns {Iterable<string?>}
	 */
	private getConstructorArguments (implementationName: string, sourceFile: SourceFile): Iterable<string|undefined> {

		// Find the matching class declaration
		const classDeclaration = this.codeAnalyzer.resolver.resolve(implementationName, sourceFile);

		// If no class were matched or if the matched node isn't a class, return an empty array of constructor arguments
		if (classDeclaration == null || !isClassDeclaration(classDeclaration)) {
			return [];
		}

		// Check if it has or inherits a constructor
		const constructor = this.getConstructor(classDeclaration);

		// If it has none, return an empty array of arguments and no serviceFile
		if (constructor == null) {
			return [];
		}

		// Otherwise, take all of the type names of the constructor (that isn't initialized to any value, otherwise we respect it)
		return this.codeAnalyzer.constructorService.getNonInitializedTypeNames(constructor);
	}

	/**
	 * Returns the constructor of a class. May resolve it through the inheritance chain
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ConstructorDeclaration|null}
	 */
	private getConstructor (classDeclaration: ClassDeclaration|ClassExpression): ConstructorDeclaration|null {
		const constructor = this.codeAnalyzer.classService.getConstructor(classDeclaration);

		// If it has a constructor, return it immediately.
		if (constructor != null) return constructor;

		// Return an empty object if the formatted class doesn't extend anything that may have a constructor
		if (this.codeAnalyzer.classService.isBaseClass(classDeclaration)) return null;

		// Otherwise, resolve the parent
		const resolvedParent = this.codeAnalyzer.classService.resolveExtendedClass(classDeclaration);

		// If a parent could not be resolved, assume that the parent is a built-in (such as Error)
		if (resolvedParent == null) {
			return null;
		}

		// Otherwise, go up the inheritance chain recursively to find the constructor
		return this.getConstructor(resolvedParent);
	}

}