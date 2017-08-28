import {ICompilerResult} from "../../Compiler/Interface/ICompiler";
import {IFormattedCallExpression} from "@wessberg/type";

export interface IServiceExpressionUpdaterUpdateMethodOptions {
	codeContainer: ICompilerResult;
	expressions: IFormattedCallExpression[];
	mappedInterfaces: IMappedInterfaceToImplementationMap;
}

export interface IServiceExpressionUpdaterRegisterExpressionHandlerOptions {
	codeContainer: ICompilerResult;
	expression: IFormattedCallExpression;
}

export interface IMappedInterfaceToImplementationMap {
	[key: string]: string;
}

export interface IServiceExpressionUpdater {
	update (options: IServiceExpressionUpdaterUpdateMethodOptions): IMappedInterfaceToImplementationMap;
}