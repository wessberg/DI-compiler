import {ICompiler, ICompilerResult} from "./Interface/ICompiler";
import {IServiceExpressionFinder} from "../ServiceExpressionFinder/Interface/IServiceExpressionFinder";
import {IMappedInterfaceToImplementationMap, IServiceExpressionUpdater} from "../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassConstructorArgumentsStringifier} from "../ClassConstructorArgumentsStringifier/Interface/IClassConstructorArgumentsStringifier";
import {IClassConstructorArgumentsValidator} from "../ClassConstructorArgumentsValidator/Interface/IClassConstructorArgumentsValidator";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IPathValidator, PathValidator} from "@wessberg/compiler-common";
import {diConfig} from "../DIConfig/DIConfig";
import {IFormattedClass} from "@wessberg/type";

/**
 * The compiler will upgrade the source code. It looks for every time a service is registered and mimics reflection.
 * Also, it tracks the constructor arguments of classes, decides if they should be dependency injected and if so the order in which
 * to do that.
 * @author Frederik Wessberg
 */
export class Compiler implements ICompiler {
	/**
	 * A collection of all classes discovered by parsing the input files
	 * @type {IFormattedClass[]}
	 */
	private static classes: IFormattedClass[] = [];

	/**
	 * A Set of all the paths that has been resolved.
	 * @type {Set<string>}
	 */
	private static resolvedPaths: Set<string> = new Set();

	/**
	 * A collection of all interfaces that has been mapped to actual implementations.
	 * @type {{}}
	 */
	private static readonly mappedInterfaces: IMappedInterfaceToImplementationMap = {};

	/**
	 * A PathValidator validates input files.
	 * @type {PathValidator}
	 */
	private pathValidator: IPathValidator = new PathValidator();

	/**
	 * The Set of all Regular Expressions for matching files to be excluded
	 * @type {Set<RegExp>}
	 */
	private excludedFiles: Set<RegExp> = new Set();

	constructor (private host: ICodeAnalyzer,
							 private serviceExpressionFinder: IServiceExpressionFinder,
							 private serviceExpressionUpdater: IServiceExpressionUpdater,
							 private classConstructorArgumentsValidator: IClassConstructorArgumentsValidator,
							 private classConstructorArgumentsStringifier: IClassConstructorArgumentsStringifier) {
	}

	/**
	 * Excludes files from the compiler that matches the provided Regular Expression(s)
	 * @param {RegExp | RegExp[] | Set<RegExp>} match
	 */
	public excludeFiles (match: RegExp|Iterable<RegExp>): void {
		// Exclude internally
		if (match instanceof RegExp) this.excludedFiles.add(match);
		else [...match].forEach(regExpItem => this.excludedFiles.add(regExpItem));

		// Exclude externally
		this.host.excludeFiles(match);
	}

	/**
	 * Validates that all constructor references to services are actually being registered as services
	 * before then moving on to generating a map between class/service identifiers and the ordered dependencies
	 * that should be dependency injected. It returns a map so that it can be added to the top of a code bundle.
	 * @returns {string}
	 */
	public getClassConstructorArgumentsMapStringified (): string {
		this.classConstructorArgumentsValidator.validate(Compiler.classes, Compiler.mappedInterfaces);
		return this.classConstructorArgumentsStringifier.getClassConstructorArgumentsStringified(Compiler.classes, Compiler.mappedInterfaces);
	}

	/**
	 * The consumable method that upgrades the code as per the class description.
	 * @param {string} filepath
	 * @param {ICompilerResult} codeContainer
	 * @returns {ICompilerResult}
	 */
	public compile (filepath: string, codeContainer: ICompilerResult): ICompilerResult {
		if (this.isExcluded(filepath)) return {hasAltered: false, code: codeContainer.code};

		const {host} = this;

		// Add the path (and the class declarations it contains) to the compiler
		Compiler.resolvedPaths.add(filepath);
		Compiler.classes.push(...this.filterOutNoInjectClasses(this.host.getClassesForFile(filepath)));

		// Finds all references to the DIContainer instance.
		const identifiers = new Set([diConfig.exportName]);

		// Finds (and validates) all expressions that has a relation to the DIContainer instance.
		const expressions = this.serviceExpressionFinder.find({host, identifiers, filepath});

		// Updates all expressions.
		this.serviceExpressionUpdater.update({codeContainer, expressions, mappedInterfaces: Compiler.mappedInterfaces});

		return codeContainer;
	}

	/**
	 * Returns true if the given filepath should be excluded
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	private isExcluded (filepath: string): boolean {
		return this.pathValidator.isBlacklisted(filepath) || [...this.excludedFiles].some(regex => regex.test(filepath));
	}

	/**
	 * Returns a new class indexer will all classes that doesn't have a @noInject decorator.
	 * @param classes
	 * @returns {IFormattedClass[]}
	 */
	private filterOutNoInjectClasses (classes: IFormattedClass[]): IFormattedClass[] {
		return classes.filter(formattedClass => formattedClass.decorators.find(decorator => decorator.toString().startsWith(`@${diConfig.decorator.noInjectName}`)) == null);
	}

}