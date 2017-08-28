import {test} from "ava";
import {compile, getIntro} from "../src/DI";
import {readFileSync} from "fs";
import {join} from "path";

test("foo", t => {
	const path = join(process.cwd(), "./test/static/01.ts");
	const compiled = compile(path, readFileSync(path).toString());
	console.log(compiled.code, getIntro());
	t.true(true);
});