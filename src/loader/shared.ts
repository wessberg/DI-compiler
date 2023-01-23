import {getTsconfig, parseTsconfig, type TsConfigResult, type TsConfigJsonResolved} from "get-tsconfig";
import type {MaybeArray} from "helpertypes";
import {FileCache} from "../transformer/cache.js";
import type {TransformOptions, TransformResult} from "../transformer/transform-options";
import type {TS} from "../type/type";
import {booleanize} from "../util/util.js";

export const ENV_VARIABLE_TSCONFIG_PATH = "DI_COMPILER_TSCONFIG_PATH";
export const ENV_VARIABLE_IDENTIFIER = "DI_COMPILER_IDENTIFIER";
export const ENV_VARIABLE_DISABLE_CACHE = "DI_COMPILER_DISABLE_CACHE";
// Only these formats have type information that can be transpiled with DICompiler
export const ALLOWED_EXTENSIONS = new Set([".ts", ".mts", ".cts"]);

interface DiTsconfigOptions {
	/**
	 * The identifier(s) that should be considered instances of DIContainer. When not given, an attempt will be
	 * made to evaluate and resolve the value of identifiers to check if they are instances of DIContainer.
	 * Providing one or more identifiers up front can be considered an optimization, as this step can be skipped that way
	 */
	identifier?: MaybeArray<string>;
	disableCache: boolean;
}

interface ExtendedTsconfig {
	di?: Partial<DiTsconfigOptions>;
	compilerOptions: TS.CompilerOptions;
}

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

	const disableCache = process.env[ENV_VARIABLE_DISABLE_CACHE] == null ? tsconfig.di?.disableCache ?? false : booleanize(process.env[ENV_VARIABLE_DISABLE_CACHE]);

	return {
		identifier,

		compilerOptions: tsconfig?.compilerOptions,
		cache: disableCache ? new Map<string, TransformResult>() : new FileCache<TransformResult>(),
		printer: typescript.createPrinter()
	};
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
