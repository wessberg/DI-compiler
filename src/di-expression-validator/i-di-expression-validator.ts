import {IDIExpressionValidatorValidateOptions} from "./i-di-expression-validator-validate-options";
import {IDIExpressionValidatorValidateResult} from "./i-di-expression-validator-validate-result";

export interface IDIExpressionValidator {
	validate (options: IDIExpressionValidatorValidateOptions): IDIExpressionValidatorValidateResult;
}