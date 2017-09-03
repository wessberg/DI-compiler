import {ICodeContainerOptions} from "./i-code-container-options";
import {ICodeContainerSourceMap} from "./i-code-container-source-map";

export interface ICodeContainer {
	readonly raw: string;
	readonly file: string;
	readonly code: string;
	readonly map: ICodeContainerSourceMap;
	readonly hasChanged: boolean;

	append (position: number, content: string): void;
}

export interface ICodeContainerConstructor {
	new (options: ICodeContainerOptions): ICodeContainer;
}