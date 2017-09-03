import {IFormattedCallExpression} from "@wessberg/type";
import {DIExpressionKind} from "./di-expression-kind";

export interface IDIExpression {
	expression: IFormattedCallExpression;
	kind: DIExpressionKind;
}

export interface IDIGetExpression extends IDIExpression {
	kind: DIExpressionKind.GET;
}

export interface IDIHasExpression extends IDIExpression {
	kind: DIExpressionKind.HAS;
}

export interface IDIRegisterExpression extends IDIExpression {
	constructorArguments: Iterable<string|undefined>;
}

export interface IDIRegisterSingletonExpression extends IDIRegisterExpression {
	kind: DIExpressionKind.REGISTER_SINGLETON;
}

export interface IDIRegisterTransientExpression extends IDIRegisterExpression {
	kind: DIExpressionKind.REGISTER_TRANSIENT;
}

export declare type DIExpression = IDIGetExpression|IDIHasExpression|IDIRegisterSingletonExpression|IDIRegisterTransientExpression;