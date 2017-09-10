import {ICodeContainerSourceMap} from "../code-container/i-code-container-source-map";

export interface IDICompilerCompileResult {
	code: string;
	map: ICodeContainerSourceMap;
	hasChanged: boolean;
	filesNeedingRecompilation: Iterable<string>;
}