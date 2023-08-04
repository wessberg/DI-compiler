import type {TS} from "../type/type.js";
import type {DiOptions} from "./di-options.js";

export interface TransformResult {
	code: string;
	map?: string;
}

export type TransformOptions = DiOptions & {
	printer?: TS.Printer;
	cache?: Map<string, TransformResult>;
};
