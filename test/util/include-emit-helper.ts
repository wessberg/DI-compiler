import type {TS} from "../../src/type/type.js";
import {getImportDefaultHelper, getImportStarHelper} from "../../src/util/ts-util.js";

export function includeEmitHelper(typescript: typeof TS, helperName: "__importStar" | "__importDefault"): string {
	const helper = helperName === "__importStar" ? getImportStarHelper(typescript) : getImportDefaultHelper(typescript);

	let str = "";
	for (const dependency of helper.dependencies ?? []) {
		str += dependency.text as string;
	}
	str += helper.text as string;
	if (str.startsWith("\n")) {
		return str.slice(1);
	} else {
		return str;
	}
}
