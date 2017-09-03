import {IDIExpressionFinderFindOptions} from "./i-di-expression-finder-find-options";
import {IDIExpressionFinderFindResult} from "./i-di-expression-finder-find-result";

export interface IDIExpressionFinder {
	find (options: IDIExpressionFinderFindOptions): IDIExpressionFinderFindResult;
}