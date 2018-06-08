import {IContainerService} from "../container/i-container-service";
import {DIExpression} from "../../di-expression/i-di-expression";

export interface IExpressionUpdaterServiceUpdateOptions {
	container: IContainerService;
	expressions: DIExpression[];
}