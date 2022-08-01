import {MaybeArray} from "helpertypes";
import {TS} from "../type/type.js";
interface DiOptionsBase {
	typescript?: typeof TS;
}

export interface DiProgramOptions extends DiOptionsBase {
	program: TS.Program;
}

export interface DiIsolatedModulesOptions extends DiOptionsBase {
	 /**
     * The identifier(s) that should be considered instances of DIContainer. When not given, an attempt will be
     * made to evaluate and resolve the value of identifiers to check if they are instances of DIContainer.
     * Providing one or more identifiers up front can be considered an optimization, as this step can be skipped that way
     */
	identifier?: MaybeArray<string>;
	compilerOptions?: TS.CompilerOptions;
}

export type DiOptions = DiProgramOptions | DiIsolatedModulesOptions;
