export interface ICodeContainerSourceMap {
	file: string;
	sources: string[];
	sourcesContent: string;
	names: string[];
	mappings: string[];
	toString (): string;
	toUrl (): string;
}