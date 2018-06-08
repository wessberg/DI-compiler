import {IDICompiler} from "./i-di-compiler";
import {IDICompilerBase} from "../i-di-compiler-base";
import {IDICompilerCompileOptions} from "../i-di-compiler-compile-options";
import {IDICompilerCompileResult} from "../i-di-compiler-compile-result";
import {DIContainer} from "@wessberg/di";

/**
 * The public facade to the DiCompilerBase
 */
export class DICompiler implements IDICompiler {

	/**
	 * Compiles based on the given options
	 * @param options
	 */
	public compile (options: IDICompilerCompileOptions): IDICompilerCompileResult {
		return DIContainer.get<IDICompilerBase>().compile(options);
	}
}