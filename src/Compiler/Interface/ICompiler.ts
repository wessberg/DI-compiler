export interface IHasAlteredable {
	hasAltered: boolean;
}

export interface ICodeable {
	code: /*tslint:disable:no-any*/any
	/*tslint:enable:no-any*/
	;
}

export interface ICompilerResult extends ICodeable, IHasAlteredable {
}

export interface ICompiler {
	excludeFiles (match: RegExp|RegExp[]|Set<RegExp>): void;
	compile (filepath: string, codeContainer: ICompilerResult): ICompilerResult;
	getClassConstructorArgumentsMapStringified (): string;
}