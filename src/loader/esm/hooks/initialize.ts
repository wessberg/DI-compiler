import type {InitializeHook} from "node:module";
import typescript from "typescript";
import {resolveOptions} from "../../shared.js";
import type {InitializationOptions} from "../types.js";
import type {TS} from "../../../type/type.js";

let data: InitializationOptions | undefined;

export function getData(): InitializationOptions | undefined {
	return data;
}

export const initialize: InitializeHook = (options?: InitializationOptions) => {
	if (options == null) {
		throw new Error("di-compiler must be loaded with --import instead of --loader\nThe --loader flag was deprecated in Node v20.6.0 and v18.19.0");
	}

	if (data == null) {
		data = {port: options.port};
	} else {
		data.port = options.port;
	}

	data.transformOptions = resolveOptions(typescript as typeof TS);
	data.typescript = typescript as typeof TS;
};
