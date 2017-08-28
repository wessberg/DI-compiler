import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IFormattedClass} from "@wessberg/type";

export interface IClassConstructorArgumentsValidator {
	validate (classes: IFormattedClass[], mappedInterfaces: IMappedInterfaceToImplementationMap): void;
}