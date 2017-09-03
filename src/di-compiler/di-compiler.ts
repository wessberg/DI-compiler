import {IDICompiler} from "./i-di-compiler";
import {IDICompilerCompileOptions} from "./i-di-compiler-compile-options";
import {IDICompilerCompileResult} from "./i-di-compiler-compile-result";
import {CodeContainer} from "../code-container/code-container";
import {CodeAnalyzer, ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IDIConfig} from "../di-config/i-di-config";
import {diConfig} from "../di-config/di-config";
import {IDIExpressionFinder} from "../di-expression-finder/i-di-expression-finder";
import {DIExpressionFinder} from "../di-expression-finder/di-expression-finder";
import {IDIExpressionValidator} from "../di-expression-validator/i-di-expression-validator";
import {DIExpressionValidator} from "../di-expression-validator/di-expression-validator";
import {IDIExpressionUpdater} from "../di-expression-updater/i-di-expression-updater";
import {DIExpressionUpdater} from "../di-expression-updater/di-expression-updater";

/**
 * A class that upgrades all DIContainer operations in the source code
 */
export class DICompiler implements IDICompiler {
	/**
	 * An analyzer that analyzes the provided code for relevant expressions
	 * @type {CodeAnalyzer}
	 */
	private readonly codeAnalyzer: ICodeAnalyzer = new CodeAnalyzer();

	/**
	 * The configuration for the DICompiler
	 * @type {IDIConfig}
	 */
	private readonly diConfig: IDIConfig = diConfig;

	/**
	 * A service that can find relevant expressions
	 * @type {DIExpressionFinder}
	 */
	private readonly diExpressionFinder: IDIExpressionFinder = new DIExpressionFinder(this.codeAnalyzer, this.diConfig);

	/**
	 * A service that can validate found expressions
	 * @type {DIExpressionValidator}
	 */
	private readonly diExpressionValidator: IDIExpressionValidator = new DIExpressionValidator(this.diConfig);

	/**
	 * A service that can update found expressions
	 * @type {DIExpressionUpdater}
	 */
	private readonly diExpressionUpdater: IDIExpressionUpdater = new DIExpressionUpdater();

	/**
	 * Compiles the provided file and code by finding all references to DIContainer and upgrading them
	 * @param {string} code
	 * @param {string} file
	 * @param {boolean} [verbose=false]
	 * @returns {IDICompilerCompileResult}
	 */
	public compile ({code, file, verbose = false}: IDICompilerCompileOptions): IDICompilerCompileResult {
		// Wrap the code inside a CodeContainer
		const codeContainer = new CodeContainer({code, file});

		// Find all DIContainer expressions
		const {expressions} = this.diExpressionFinder.find({file});

		// Validate all of the DIContainer expressions
		const diagnostics = this.diExpressionValidator.validate({expressions});

		// Print all of them (if there are any). If verbose = true, it will print something no matter what
		if (diagnostics.diagnostics.length > 0 || verbose) diagnostics.print();

		// Update all of the expressions
		this.diExpressionUpdater.update({codeContainer, expressions});

		return {
			hasChanged: codeContainer.hasChanged,
			code: codeContainer.code,
			map: codeContainer.map
		};
	}
}