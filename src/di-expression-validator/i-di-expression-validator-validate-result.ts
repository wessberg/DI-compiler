import {DIExpressionDiagnostic} from "../di-expression-diagnostic/i-di-expression-diagnostic";

export interface IDIExpressionValidatorValidateResult {
	diagnostics: DIExpressionDiagnostic[];
	print (): void;
}