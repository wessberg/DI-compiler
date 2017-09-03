import {IDICompilerCompileOptions} from "./i-di-compiler-compile-options";
import {IDICompilerCompileResult} from "./i-di-compiler-compile-result";

export interface IDICompiler {
	compile (options: IDICompilerCompileOptions): IDICompilerCompileResult;
}