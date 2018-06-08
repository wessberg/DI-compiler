import "../../src";
import {test} from "ava";
import {readFileSync} from "fs";
import {join} from "path";
import {DIContainer} from "@wessberg/di";
import {IDICompiler} from "../../src/di-compiler/public/i-di-compiler";

const compiler = DIContainer.get<IDICompiler>();

test("foo", t => {
	const path = join(process.cwd(), "./test/static/02.ts");
	const compiled = compiler.compile({file: path, code: readFileSync(path).toString()});
	console.log(compiled.code);
	t.true(compiled != null);
});