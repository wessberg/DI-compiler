import {ICodeContainerOptions} from "./i-code-container-options";
import {SourceMap} from "magic-string";

export interface ICodeContainer {
	readonly raw: string;
	readonly file: string;
	readonly code: string;
	readonly map: SourceMap;
	readonly hasChanged: boolean;

	append (content: string, position?: number): void;
	prepend (content: string, position?: number): void;
}

export interface ICodeContainerConstructor {
	new (options: ICodeContainerOptions): ICodeContainer;
}