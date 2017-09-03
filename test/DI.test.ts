import {test} from "ava";
import {readFileSync} from "fs";
import {join} from "path";
import {DICompiler} from "../src/di-compiler/di-compiler";

const compiler = new DICompiler();

test("foo", t => {
	const path = join(process.cwd(), "./test/static/02.ts");
	const compiled = compiler.compile({file: path, code: readFileSync(path).toString()});
	console.log(compiled.code);
	t.true(compiled != null);
});