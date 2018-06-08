import {IExpressionUpdaterServiceUpdateOptions} from "./i-expression-updater-service-update-options";

export interface IExpressionUpdaterService {
	update (options: IExpressionUpdaterServiceUpdateOptions): void;
}