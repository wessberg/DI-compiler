import {DIExpressionDiagnosticKind} from "./di-expression-diagnostic-kind";

export interface IDIExpressionDiagnostic {
	kind: DIExpressionDiagnosticKind;
	reason: string;
	file: string;
	position: number;
	content: string;
}

export interface IDIExpressionTypeArgumentDiagnostic extends IDIExpressionDiagnostic {
	kind: DIExpressionDiagnosticKind.TYPE_ARGUMENT;
}

export interface IDIExpressionUserProvidedArgumentDiagnostic extends IDIExpressionDiagnostic {
	kind: DIExpressionDiagnosticKind.USER_PROVIDED_ARGUMENT;
}

export interface IDIExpressionProtectedConstructorDiagnostic extends IDIExpressionDiagnostic {
	kind: DIExpressionDiagnosticKind.PROTECTED_CONSTRUCTOR;
}

export declare type DIExpressionDiagnostic = IDIExpressionTypeArgumentDiagnostic|IDIExpressionUserProvidedArgumentDiagnostic|IDIExpressionProtectedConstructorDiagnostic;