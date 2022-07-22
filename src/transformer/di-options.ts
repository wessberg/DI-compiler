import {MaybeArray} from "helpertypes";
import {TS} from "../type/type.js";
interface DiOptionsBase {
	typescript?: typeof TS;
}

export interface DiProgramOptions extends DiOptionsBase {
	program: TS.Program;
}

export interface DiIsolatedModulesOptions extends DiOptionsBase {
	match: MaybeArray<string | RegExp>;
	compilerOptions?: TS.CompilerOptions;
}

export type DiOptions = DiProgramOptions | DiIsolatedModulesOptions;
