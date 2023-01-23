import type {TS} from "../type/type";
import type {DiOptions} from "./di-options";

export interface TransformResult {
	code: string;
	map?: string;
}

export type TransformOptions = DiOptions & {
	printer?: TS.Printer;
	cache?: Map<string, TransformResult>;
};
