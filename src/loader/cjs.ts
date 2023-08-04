import typescript from "typescript";
import {transform} from "../transformer/transform.js";
import pirates from "pirates";
import {ALLOWED_EXTENSIONS, resolveOptions} from "./shared.js";
import type { TS } from "../type/type.js";

const transformOptions = resolveOptions(typescript as typeof TS);

pirates.addHook(
	(code, filename) =>
		transform(code.toString(), filename, {
			...transformOptions,
			typescript: typescript as typeof TS
		}).code,
	{exts: [...ALLOWED_EXTENSIONS]}
);
