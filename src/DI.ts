import {CodeAnalyzer} from "@wessberg/codeanalyzer";
import {TypeDetector} from "@wessberg/typedetector";
import * as MagicString from "magic-string";
import {ClassConstructorArgumentsStringifier} from "./ClassConstructorArgumentsStringifier/ClassConstructorArgumentsStringifier";
import {ClassConstructorArgumentsValidator} from "./ClassConstructorArgumentsValidator/ClassConstructorArgumentsValidator";
import {Compiler} from "./Compiler/Compiler";
import {ICompilerResult, IHasAlteredable} from "./Compiler/Interface/ICompiler";
import {ContainerReferenceFinder} from "./ContainerReferenceFinder/ContainerReferenceFinder";
import {diConfig} from "./DIConfig/DIConfig";
import {ServiceExpressionFinder} from "./ServiceExpressionFinder/ServiceExpressionFinder";
import {ServiceExpressionUpdater} from "./ServiceExpressionUpdater/ServiceExpressionUpdater";
import {shimGlobalObjectStringified} from "@wessberg/globalobject";

export interface ICompileFileResult extends IHasAlteredable {
	code: string;
	map: string;
}

const typeDetector = new TypeDetector();
const compiler = new Compiler(
	new CodeAnalyzer(),
	new ContainerReferenceFinder(diConfig),
	new ServiceExpressionFinder(),
	new ServiceExpressionUpdater(diConfig, typeDetector),
	new ClassConstructorArgumentsValidator(),
	new ClassConstructorArgumentsStringifier(diConfig)
);

/**
 * The public method of DI. This is build-tool agnostic and only cares about getting an id and some code.
 * It will upgrade the code (see the Compiler class description) and return the upgraded code and generate a sourcemap.
 * @param {string} id
 * @param {string} code
 * @param {RegExp|RegExp[]|Set<RegExp>} [excludePaths]
 * @returns {ICompileFileResult}
 */
export function compile (id: string, code: string, excludePaths?: RegExp|RegExp[]|Set<RegExp>): ICompileFileResult {
	const magicString = new (</*tslint:disable:no-any*/any/*tslint:enable:no-any*/>MagicString)(code);
	if (excludePaths != null) compiler.excludeFiles(excludePaths);

	const codeContainer: ICompilerResult = {
		code: magicString,
		hasAltered: false
	};

	const result = compiler.compile(id, codeContainer);

	return {
		hasAltered: result.hasAltered,
		code: result.code.toString(),
		map: result.code.generateMap({
			hires: true
		})
	};
}

/**
 * Retrieves and returns a stringified map between class identifiers and their constructor arguments.
 * @param {boolean} [shimGlobalObject=false]
 * @returns {string}
 */
export function getIntro (shimGlobalObject: boolean = false): string {
	const stringifiedMap = compiler.getClassConstructorArgumentsMapStringified();
	return shimGlobalObject ? `${shimGlobalObjectStringified}\n${stringifiedMap}` : stringifiedMap;
}