import {ICodeContainerOptions} from "./i-code-container-options";
import {SourceMap} from "magic-string";

export interface ICodeContainer {
	readonly raw: string;
	readonly file: string;
	readonly code: string;
	readonly map: SourceMap;
	readonly hasChanged: boolean;

	append (position: number, content: string): void;
}

export interface ICodeContainerConstructor {
	new (options: ICodeContainerOptions): ICodeContainer;
}