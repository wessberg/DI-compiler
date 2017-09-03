import {IDIExpressionUpdaterUpdateOptions} from "./i-di-expression-updater-update-options";

export interface IDIExpressionUpdater {
	update (options: IDIExpressionUpdaterUpdateOptions): void;
}