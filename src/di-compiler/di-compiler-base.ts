import {IDICompilerBase} from "./i-di-compiler-base";
import {IDICompilerCompileOptions} from "./i-di-compiler-compile-options";
import {IDICompilerCompileResult} from "./i-di-compiler-compile-result";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IConstructorArgumentService} from "../service/constructor/i-constructor-argument-service";
import {IContainerServiceConstructor} from "../service/container/i-container-service";
import {IDIConfig} from "../di-config/i-di-config";
import {IExpressionFinderService} from "../service/expression-finder/i-expression-finder-service";
import {IExpressionValidatorService} from "../service/expression-validator/i-expression-validator-service";
import {IExpressionUpdaterService} from "../service/expression-updater/i-expression-updater-service";

/**
 * A class that upgrades all DIContainer operations in the source code
 */
export class DICompilerBase implements IDICompilerBase {

	constructor (private readonly diConfig: IDIConfig,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly containerServiceCtor: IContainerServiceConstructor,
							 private readonly constructorArgumentService: IConstructorArgumentService,
							 private readonly expressionFinderService: IExpressionFinderService,
							 private readonly expressionValidatorService: IExpressionValidatorService,
							 private readonly expressionUpdaterService: IExpressionUpdaterService) {
	}

	/**
	 * Compiles the provided file and code by finding all references to DIContainer and upgrading them
	 * @param {string} code
	 * @param {string} file
	 * @param {boolean} [verbose=false]
	 * @returns {IDICompilerCompileResult}
	 */
	public compile ({code, file, verbose = false}: IDICompilerCompileOptions): IDICompilerCompileResult {
		// Wrap the code inside a CodeContainer
		const container = new this.containerServiceCtor(code, {filename: file, indentExclusionRanges: []});
		const sourceFile = this.codeAnalyzer.languageService.addFile({path: file, content: code});

		// Take all classes that are declared within the SourceFile
		const classes = this.codeAnalyzer.classService.getAll(sourceFile);

		// For each of them, detect the constructor arguments and write them to the file
		for (const classDeclaration of classes) {
			const ctor = this.constructorArgumentService.getConstructorArguments(classDeclaration);

			container.append(`\n(<any>${this.codeAnalyzer.classService.getNameOfClass(classDeclaration)}).${this.diConfig.argumentsProperty} = ${ctor == null ? "[]" : `[${ctor.args.map(arg => typeof arg === "string" ? `"${arg}"` : undefined).join(",")}]`};`);
		}

		// Now, also find all relevant expressions
		const {expressions} = this.expressionFinderService.find({sourceFile});

		// Validate all of the DIContainer expressions
		const diagnostics = this.expressionValidatorService.validate({expressions});

		// Print all of them (if there are any). If verbose = true, it will print something no matter what
		if (diagnostics.diagnostics.length > 0 || verbose) diagnostics.print();

		// Update all of the expressions
		this.expressionUpdaterService.update({container, expressions});

		return {
			hasChanged: container.hasChanged,
			code: container.toString(),
			map: container.generateMap({file: container.file, hires: true})
		};
	}
}