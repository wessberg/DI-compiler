import path from "node:path";
import fs from "node:fs/promises";
import urlModule from "node:url";
import type {LoadHook} from "node:module";
import {transform} from "../../../transformer/transform.js";
import {ALLOWED_EXTENSIONS} from "../../shared.js";
import {getData} from "./initialize.js";

export const load: LoadHook = async (url, context, nextLoad) => {
	const loaded = await nextLoad(url, context);
	const data = getData();

	const filePath = url.startsWith("file://") ? urlModule.fileURLToPath(url) : url;

	if (ALLOWED_EXTENSIONS.has(path.extname(filePath))) {
		const rawSource = await fs.readFile(new URL(url), "utf-8");

		const {code: source} = transform(rawSource.toString(), filePath, data);
		loaded.source = source;
	}

	return loaded;
};
