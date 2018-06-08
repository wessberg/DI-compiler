import MagicString, {MagicStringOptions} from "magic-string";
import {IPlacement} from "@wessberg/codeanalyzer";

export interface IContainerService extends MagicString {
	readonly file: string;
	hasChanged: boolean;
	appendAtPlacement (content: string, placement: IPlacement): void;
}

export interface IContainerServiceConstructor {
	new (content: string, options: MagicStringOptions): IContainerService;
}