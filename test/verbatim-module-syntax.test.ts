import {generateCustomTransformerResult} from "./setup/setup-custom-transformer.js";
import {generateTransformResult} from "./setup/setup-transform.js";
import {formatCode} from "./util/format-code.js";
import {test} from "./util/test-runner.js";
import assert from "node:assert";

test("Relevant type-only imports for DIContainer are preserved, but replaced, under verbatim module syntax. #1", ">3.7", (_, {typescript}) => {
	const {code} = generateTransformResult(
		`import {DIContainer} from "@wessberg/di";
		import type {IFoo} from "./foo";
		
		const container = new DIContainer();
		container.get<IFoo>();`,
		{
			typescript,
			compilerOptions: {
				sourceMap: false,
				verbatimModuleSyntax: true
			}
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { DIContainer } from "@wessberg/di";
		import type { IFoo } from "./foo";
		const container = new DIContainer();
		container.get<IFoo>({ identifier: "IFoo" });
		`)
	);
});

test("Relevant type-only imports for DIContainer are preserved, but replaced, under verbatim module syntax. #2", ">3.7", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import type {IFoo, Foo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `
				export interface IFoo {}
				export class Foo implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				sourceMap: false,
				verbatimModuleSyntax: true
			}
		}
	);
	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	console.log(formatCode(file.text));

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
			import { Foo } from "./foo";
			import { DIContainer } from "@wessberg/di";
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
	);
});
