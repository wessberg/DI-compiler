import {ICompilerResult} from "../../Compiler/Interface/ICompiler";
import {ICallExpression} from "@wessberg/codeanalyzer";

export interface IServiceExpressionUpdaterUpdateMethodOptions {
	codeContainer: ICompilerResult;
	expressions: ICallExpression[];
	mappedInterfaces: IMappedInterfaceToImplementationMap;
}

export interface IServiceExpressionUpdaterRegisterExpressionHandlerOptions {
	codeContainer: ICompilerResult;
	expression: ICallExpression;
}

export interface IMappedInterfaceToImplementationMap {
	[key: string]: string;
}

export interface IServiceExpressionUpdater {
	update (options: IServiceExpressionUpdaterUpdateMethodOptions): IMappedInterfaceToImplementationMap;
}