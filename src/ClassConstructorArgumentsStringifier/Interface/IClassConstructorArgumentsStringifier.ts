import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IFormattedClass} from "@wessberg/type";

export interface IClassConstructorArgumentsStringifier {
	getClassConstructorArgumentsStringified (classes: IFormattedClass[], mappedInterfaces: IMappedInterfaceToImplementationMap): string;
}