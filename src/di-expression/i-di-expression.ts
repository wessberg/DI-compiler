import {DIExpressionKind} from "./di-expression-kind";
import {PropertyAccessCallExpression} from "@wessberg/codeanalyzer";

export interface IDIExpression {
	expression: PropertyAccessCallExpression;
	typeName: string;
	file: string;
	kind: DIExpressionKind;
}

export interface IDIGetExpression extends IDIExpression {
	kind: DIExpressionKind.GET;
}

export interface IDIHasExpression extends IDIExpression {
	kind: DIExpressionKind.HAS;
}

export interface IDIRegisterExpression extends IDIExpression {
	implementationName: string;
	constructorArguments: Iterable<string|undefined>;
	serviceFile: string|null;
}

export interface IDIRegisterSingletonExpression extends IDIRegisterExpression {
	kind: DIExpressionKind.REGISTER_SINGLETON;
}

export interface IDIRegisterTransientExpression extends IDIRegisterExpression {
	kind: DIExpressionKind.REGISTER_TRANSIENT;
}

export declare type DIExpression = IDIGetExpression|IDIHasExpression|IDIRegisterSingletonExpression|IDIRegisterTransientExpression;