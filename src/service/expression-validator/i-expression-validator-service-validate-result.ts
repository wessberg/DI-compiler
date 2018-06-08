import {DIExpressionDiagnostic} from "../../di-expression-diagnostic/i-di-expression-diagnostic";

export interface IExpressionValidatorServiceValidateResult {
	diagnostics: DIExpressionDiagnostic[];
	print (): void;
}