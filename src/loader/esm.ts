import typescript from "typescript";
import path from "path";
import fs from "fs/promises";
import urlModule from "url";
import {transform} from "../transformer/transform.js";
import {ALLOWED_EXTENSIONS, resolveOptions} from "./shared.js";

interface LoadContext {
	format: string;
	importAssertions: Record<string, string>;
}

interface LoadResult {
	format: string;
	shortCircuit?: boolean;
	source?: string | ArrayBuffer;
}

type NextLoad = (url: string, context: LoadContext) => Promise<LoadResult>;
type Load = (url: string, context: LoadContext, nextLoad: NextLoad) => Promise<LoadResult>;

const transformOptions = resolveOptions(typescript);

export const load: Load = async (url, context, nextLoad) => {
	if (ALLOWED_EXTENSIONS.has(path.extname(url))) {

		const fileName = urlModule.fileURLToPath(url);
		const rawSource = await fs.readFile(fileName, "utf-8");

		if (rawSource != null) {
			const {code: source} = transform(rawSource.toString(), fileName, {
				...transformOptions,
				typescript
			});

			return {
				format: context.format ?? "module",
				shortCircuit: true,
				source
			};
		}
	}

	// Defer to the next hook in the chain.
	return nextLoad(url, context);
};
