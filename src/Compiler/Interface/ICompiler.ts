export interface IHasAlteredable {
	hasAltered: boolean;
}

export interface ICodeable {
	code: any;
}

export interface ICompilerResult extends ICodeable, IHasAlteredable {
}

export interface ICompiler {
	excludeFiles (match: RegExp|RegExp[]|Set<RegExp>): void;
	compile (filepath: string, codeContainer: ICompilerResult): ICompilerResult;
	getClassConstructorArgumentsMapStringified (): string;
}