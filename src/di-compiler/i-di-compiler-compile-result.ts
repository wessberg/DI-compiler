import {SourceMap} from "magic-string";

export interface IDICompilerCompileResult {
	code: string;
	map: SourceMap;
	hasChanged: boolean;
	filesNeedingRecompilation: Iterable<string>;
}