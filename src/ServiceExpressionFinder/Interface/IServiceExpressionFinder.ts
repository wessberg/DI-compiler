import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IFormattedCallExpression} from "@wessberg/type";

export interface IServiceExpressionFinderFindMethodOptions {
	host: ICodeAnalyzer;
	identifiers: Set<string>;
	filepath: string;
}

export interface IServiceExpressionFinder {
	find (options: IServiceExpressionFinderFindMethodOptions): IFormattedCallExpression[];
}