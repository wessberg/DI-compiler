import {IExpressionValidatorServiceValidateOptions} from "./i-expression-validator-service-validate-options";
import {IExpressionValidatorServiceValidateResult} from "./i-expression-validator-service-validate-result";

export interface IExpressionValidatorService {
	validate (options: IExpressionValidatorServiceValidateOptions): IExpressionValidatorServiceValidateResult;
}