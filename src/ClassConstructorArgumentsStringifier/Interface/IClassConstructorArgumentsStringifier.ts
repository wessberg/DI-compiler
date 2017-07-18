import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassIndexer} from "@wessberg/codeanalyzer";

export interface IClassConstructorArgumentsStringifier {
	getClassConstructorArgumentsStringified (classes: IClassIndexer, mappedInterfaces: IMappedInterfaceToImplementationMap): string;
}