import {getTsconfig, parseTsconfig, type TsConfigResult, type TsConfigJsonResolved} from "get-tsconfig";
import type {MaybeArray} from "helpertypes";
import {FileCache} from "../transformer/cache.js";
import type {TransformOptions, TransformResult} from "../transformer/transform-options.js";
import type {TS} from "../type/type.js";
import {booleanize} from "../util/util.js";
import { DI_CONTAINER_NAME } from '../transformer/constant.js';

export const ENV_VARIABLE_TSCONFIG_PATH = "DI_COMPILER_TSCONFIG_PATH";
export const ENV_VARIABLE_IDENTIFIER = "DI_COMPILER_IDENTIFIER";
export const ENV_VARIABLE_DISABLE_CACHE = "DI_COMPILER_DISABLE_CACHE";
export const ENV_VARIABLE_CLASS_NAME = "DI_COMPILER_CLASS_NAME";

// Only these formats have type information that can be transpiled with DICompiler
export const ALLOWED_EXTENSIONS = new Set([".ts", ".mts", ".cts"]);

interface DiTsconfigOptions {
	/**
	 * The identifier(s) that should be considered instances of DIContainer. When not given, an attempt will be
	 * made to evaluate and resolve the value of identifiers to check if they are instances of DIContainer.
	 * Providing one or more identifiers up front can be considered an optimization, as this step can be skipped that way
	 */
	identifier?: MaybeArray<string>;
	/*
	 * Additional class name(s) that should be considered as the implementation class DIContainer. Required when inheriting
	 * from DIContainer to add functionality to have the transformer recognize the class as a DIContainer.
	 */
	diClassName?: MaybeArray<string>;
	disableCache: boolean;
}

interface ExtendedTsconfig {
	di?: Partial<DiTsconfigOptions>;
	compilerOptions: TS.CompilerOptions;
}

let diClassName: MaybeArray<string> | undefined;

export function resolveOptions(typescript: typeof TS): Partial<TransformOptions> {
	const tsconfig = upgradeTsconfig(
		typescript,
		process.env[ENV_VARIABLE_TSCONFIG_PATH] != null
			? {
					path: process.env[ENV_VARIABLE_TSCONFIG_PATH],
					config: parseTsconfig(process.env[ENV_VARIABLE_TSCONFIG_PATH])
			  }
			: getTsconfig() ?? undefined
	);

	let identifier =
		process.env[ENV_VARIABLE_IDENTIFIER]?.split(",")
			.map(item => item.trim())
			.filter(item => item.length > 0) ?? tsconfig.di?.identifier;

	if (Array.isArray(identifier) && identifier.length === 1) {
		identifier = identifier[0];
	}

	diClassName =
		process.env[ENV_VARIABLE_CLASS_NAME]?.split(",")
			.map(item => item.trim())
			.filter(item => item.length > 0) ?? tsconfig.di?.diClassName;

	if (Array.isArray(diClassName) && diClassName.length === 1) {
		diClassName = diClassName[0];
	}

	const disableCache = process.env[ENV_VARIABLE_DISABLE_CACHE] == null ? tsconfig.di?.disableCache ?? false : booleanize(process.env[ENV_VARIABLE_DISABLE_CACHE]);

	return {
		identifier,

		compilerOptions: tsconfig?.compilerOptions,
		cache: disableCache ? new Map<string, TransformResult>() : new FileCache<TransformResult>(),
		printer: typescript.createPrinter()
	};
}

export function isDiClassName(name: string | TS.__String): boolean {
	if (name === DI_CONTAINER_NAME) {
		return true;
	}
	return diClassName == null ? false : Array.isArray(diClassName) ? diClassName.includes(<string> name) : diClassName === name;
}

function upgradeTsconfig(typescript: typeof TS, input?: TsConfigResult | TsConfigJsonResolved): ExtendedTsconfig {
	if (input == null) {
		return {
			compilerOptions: overrideCompilerOptions(typescript.getDefaultCompilerOptions())
		};
	}
	const inputDiOptions = "config" in input ? (input.config as {di?: Partial<DiTsconfigOptions>}).di : (input as {di?: Partial<DiTsconfigOptions>}).di;
	const inputCompilerOptions = "config" in input ? input.config.compilerOptions : input.compilerOptions;
	if (inputCompilerOptions == null) {
		return {
			di: inputDiOptions,
			compilerOptions: overrideCompilerOptions(typescript.getDefaultCompilerOptions())
		};
	}
	return {
		di: inputDiOptions,
		compilerOptions: overrideCompilerOptions(typescript.convertCompilerOptionsFromJson(inputCompilerOptions, inputCompilerOptions.baseUrl ?? ".").options)
	};
}

function overrideCompilerOptions(input: TS.CompilerOptions): TS.CompilerOptions {
	return {
		...input,
		// We always want to inline source maps when DICompiler is used as a loader
		...(input.sourceMap === true ? {inlineSourceMap: true} : {}),
		preserveValueImports: true
	};
}
