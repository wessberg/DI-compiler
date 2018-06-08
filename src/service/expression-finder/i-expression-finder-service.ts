import {IExpressionFinderServiceFindOptions} from "./i-expression-finder-service-find-options";
import {IExpressionFinderServiceFindResult} from "./i-expression-finder-service-find-result";

export interface IExpressionFinderService {
	find (options: IExpressionFinderServiceFindOptions): IExpressionFinderServiceFindResult;
}