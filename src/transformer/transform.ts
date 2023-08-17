import path from "crosspath";
import {getBaseVisitorContext} from "./get-base-visitor-context.js";
import type {TransformOptions, TransformResult} from "./transform-options.js";
import {ensureArray, sha1} from "../util/util.js";
import type {BaseVisitorContext} from "./visitor-context.js";
import type {TSEmitHost, TSExtended, TSExtendedPrinter, TSSourceMapGenerator, TSSourceMapGeneratorOptions} from "../type/type.js";
import {ensureNodeFactory} from "compatfactory";
import {transformSourceFile} from "./before/before-transformer.js";

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function transform(source: string, options?: TransformOptions): TransformResult;
export function transform(source: string, filename: string, options?: TransformOptions): TransformResult;
export function transform(source: string, filenameOrOptions: string | TransformOptions | undefined, optionsOrUndefined?: TransformOptions): TransformResult {
	const filename = typeof filenameOrOptions === "string" ? filenameOrOptions : "file.ts";
	const options = typeof filenameOrOptions === "string" ? optionsOrUndefined : filenameOrOptions;

	const baseVisitorContext = getBaseVisitorContext(options);

	// By preserving value imports, we can avoid the `after` transformer entirely,
	// as well as adding/tracking imports,since nothing will be stripped away.
	baseVisitorContext.compilerOptions.preserveValueImports = true;

	const {compilerOptions} = baseVisitorContext;
	const typescript = baseVisitorContext.typescript as TSExtended;

	const hash = generateCacheKey(source, baseVisitorContext, options);
	const cacheHit = hash == null ? undefined : options?.cache?.get(hash);

	if (cacheHit != null) {
		return cacheHit;
	}

	const newLine = typescript.sys.newLine;
	const printer = (options?.printer ?? typescript.createPrinter()) as TSExtendedPrinter;
	const factory = ensureNodeFactory(typescript);

	// An undocumented internal helper can be leveraged here
	const transformationContext = typescript.nullTransformationContext;
	const visitorContext = {...baseVisitorContext, transformationContext, factory};

	const sourceFile = typescript.createSourceFile(filename, source, typescript.ScriptTarget.ESNext, true);
	const transformedSourceFile = transformSourceFile(sourceFile, visitorContext);

	let result: TransformResult;

	if (Boolean(compilerOptions.sourceMap)) {
		const sourceMapOptions: TSSourceMapGeneratorOptions = {
			sourceMap: Boolean(compilerOptions.sourceMap),
			sourceRoot: "",
			mapRoot: "",
			extendedDiagnostics: false
		};

		const emitHost: TSEmitHost = {
			getCanonicalFileName: typescript.createGetCanonicalFileName(typescript.sys.useCaseSensitiveFileNames),
			getCompilerOptions: () => compilerOptions,
			getCurrentDirectory: () => path.dirname(filename)
		};

		const sourceMapGenerator = typescript.createSourceMapGenerator(emitHost, path.basename(filename), sourceMapOptions.sourceRoot, path.dirname(filename), sourceMapOptions);
		const writer = typescript.createTextWriter(newLine);
		printer.writeFile(transformedSourceFile, writer, sourceMapGenerator);

		const sourceMappingUrl = getSourceMappingUrl(sourceMapGenerator, filename, Boolean(compilerOptions.inlineSourceMap));
		if (sourceMappingUrl.length > 0) {
			if (!writer.isAtStartOfLine()) writer.rawWrite(newLine);
			writer.writeComment("//# ".concat("sourceMappingURL", "=").concat(sourceMappingUrl)); // Tools can sometimes see this line as a source mapping url comment
		}

		result = {
			code: writer.getText(),
			map: Boolean(compilerOptions.inlineSourceMap) ? undefined : sourceMapGenerator.toString()
		};
	} else {
		result = {
			code: printer.printFile(transformedSourceFile)
		};
	}

	if (hash != null && options?.cache != null) {
		options.cache.set(hash, result);
	}

	return result;
}

function generateCacheKey(source: string, context: BaseVisitorContext, options: TransformOptions | undefined): string | undefined {
	// No point in calculating a hash if there's no cache in use
	if (options?.cache == null) return undefined;

	const identifier = options != null && "identifier" in options ? options.identifier : undefined;
	let key = source;
	if (identifier != null) {
		key += ensureArray(identifier).join(",");
	}

	key += Boolean(context.compilerOptions.sourceMap);
	return sha1(key);
}

function getSourceMappingUrl(sourceMapGenerator: TSSourceMapGenerator, filePath: string, inline: boolean) {
	if (inline) {
		// Encode the sourceMap into the sourceMap url
		const sourceMapText = sourceMapGenerator.toString();
		const base64SourceMapText = Buffer.from(sourceMapText).toString("base64");
		return "data:application/json;base64,".concat(base64SourceMapText);
	}
	const sourceMapFilePath = `${filePath}.map`;
	const sourceMapFile = path.basename(sourceMapFilePath);

	return encodeURI(sourceMapFile);
}
