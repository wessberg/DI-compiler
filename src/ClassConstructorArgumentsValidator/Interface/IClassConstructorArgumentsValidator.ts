import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassIndexer} from "@wessberg/codeanalyzer";

export interface IClassConstructorArgumentsValidator {
	validate (classes: IClassIndexer, mappedInterfaces: IMappedInterfaceToImplementationMap): void;
}