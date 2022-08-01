import * as TS from "typescript";
export {TS};

export interface TSTextWriter {
	rawWrite(text: string): void;
	isAtStartOfLine(): boolean;
	getText(): string;
	writeComment(comment: string): void;
}

export interface TSSourceMapGenerator {}

export interface TSSourceMapGeneratorOptions {
	sourceMap: boolean;
	sourceRoot: string;
	mapRoot: string;
	extendedDiagnostics: boolean;
}

export interface TSEmitHost {
	getCanonicalFileName(input: string): string;
	getCompilerOptions(): TS.CompilerOptions;
	getCurrentDirectory(): string;
}

export type TSExtended = typeof TS & {
    nullTransformationContext: TS.TransformationContext;
	createGetCanonicalFileName(useCaseSensitiveFileNames: boolean): (input: string) => string;
	createSourceMapGenerator(emitHost: TSEmitHost, file: string, sourceRoot: string, sourcesDirectoryPath: string, mapOptions: TSSourceMapGeneratorOptions): TSSourceMapGenerator;
	createTextWriter(newLine: string): TSTextWriter;
};

export type TSExtendedPrinter = TS.Printer & {
	writeFile(file: TS.SourceFile, writer: TSTextWriter, sourceMapGenerator: TSSourceMapGenerator): void;
};