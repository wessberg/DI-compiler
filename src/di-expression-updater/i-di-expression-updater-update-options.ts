import {ICodeContainer} from "../code-container/i-code-container";
import {DIExpression} from "../di-expression/i-di-expression";

export interface IDIExpressionUpdaterUpdateOptions {
	codeContainer: ICodeContainer;
	expressions: DIExpression[];
}