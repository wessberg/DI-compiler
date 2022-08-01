import typescript from "typescript";
import {transform} from "../transformer/transform.js";
import pirates from "pirates";
import {ALLOWED_EXTENSIONS, resolveOptions} from "./shared";

const transformOptions = resolveOptions(typescript);

pirates.addHook(
	(code, filename) =>
		transform(code.toString(), filename, {
			...transformOptions,
			typescript
		}).code,
	{exts: [...ALLOWED_EXTENSIONS]}
);
