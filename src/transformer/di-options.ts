import type {MaybeArray} from "helpertypes";
import type {TS} from "../type/type.js";
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
	/*
	 * Additional class name(s) that should be considered as the implementation class DIContainer. Required when inheriting
	 * from DIContainer to add functionality to have the transofmrer recognize the class as a DIContainer.
	 */
	diClassName?: MaybeArray<string>;
	compilerOptions?: TS.CompilerOptions;
}

export type DiOptions = DiProgramOptions | DiIsolatedModulesOptions;
