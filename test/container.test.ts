import {generateCustomTransformerResult} from "./setup/setup-custom-transformer.js";
import {formatCode} from "./util/format-code.js";
import semver from "semver";
import {test} from "./util/test-runner.js";
import assert from "node:assert";

test("Only considers containers that are instances of DIContainer. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				class Foo {}
				class MyContainer {
					registerSingleton<T> (): T|undefined {
						console.log("foo");
						return undefined;
					}
				}
				const container = new MyContainer();
				container.registerSingleton<Foo>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			class Foo {}
			class MyContainer {
				registerSingleton () {
					console.log("foo");
					return undefined;
				}
			}
			const container = new MyContainer();
			container.registerSingleton(); 
			`)
	);
});

test("Supports ElementAccessExpressions. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				class Foo {}
				const container = new DIContainer();

				container["registerSingleton"]<Foo>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container["registerSingleton"](undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
	);
});

test("Supports ElementAccessExpressions when an identifier is passed. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				class Foo {}
				const container = new DIContainer();

				container["registerSingleton"]<Foo>();
			`
			}
		],
		{typescript, useProgram, identifier: "container"}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container["registerSingleton"](undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
	);
});

test("Supports ElementAccessExpressions. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				class Foo {}
				const container = new DIContainer();
				const argumentExpression = "registerSingleton";

				container[argumentExpression]<Foo>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			const argumentExpression = "registerSingleton";
			container[argumentExpression](undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
	);
});

test("Supports ElementAccessExpressions when an identifier is passed. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				class Foo {}
				const container = new DIContainer();
				const argumentExpression = "registerSingleton";

				container[argumentExpression]<Foo>();
			`
			}
		],
		{typescript, useProgram, identifier: "container"}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			const argumentExpression = "registerSingleton";
			container[argumentExpression](undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
	);
});

test("Supports PropertyAccessExpressions. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo {}
				
				class Foo implements IFoo {}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
	);
});

test("Supports PropertyAccessExpressions when an identifier is passed. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo {}
				
				class Foo implements IFoo {}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			}
		],
		{typescript, useProgram, identifier: "container"}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
	);
});

test("Supports PropertyAccessExpressions. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo {}
				
				class Foo implements IFoo {}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>(undefined);
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
	);
});

test("Won't include imports multiple times when the same implementation is registered multiple times. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import {IFoo, Foo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
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
		{typescript, useProgram}
	);
	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
			import { Foo } from "./foo";
      import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
      container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
	);
});

test("Supports custom implementation functions. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo {
					foo: string;
				}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo>(() => ({foo: "hello"}));
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			const container = new DIContainer();
			container.registerSingleton(() => ({foo: "hello"}), { identifier: \`IFoo\` });
			`)
	);
});

test("Supports custom implementation functions. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface Foo {

				}
				function foo (options: any): Foo {
					return {};
				}

				export const container = new DIContainer();
				// DAL
				container.registerSingleton<Foo>(() => foo(options));
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			function foo(options) {
				return {};
			}
			export const container = new DIContainer();
			// DAL
			container.registerSingleton(() => foo(options), { identifier: \`Foo\` });`)
	);
});

test("Supports custom implementation functions. #3", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface Foo {

				}
				function foo (options: any): Foo {
					return {};
				}

				export const container = new DIContainer();
				// DAL
				container.registerSingleton<Foo, Foo>(() => foo(options));
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			function foo(options) {
				return {};
			}
			export const container = new DIContainer();
			// DAL
			container.registerSingleton(() => foo(options), { identifier: \`Foo\` });`)
	);
});

test("When registering a service, the implementation type argument is treated as an optional argument. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				class Foo {}
				
				const container = new DIContainer();
				container.registerSingleton<Foo>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
	);
});

test("When registering a service, the type arguments should be irrelevant. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo<T> {}
				class Foo<T> {}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo<string>, Foo<string>>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
	);
});

test("When registering a service, the type arguments should be irrelevant. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo<T> {}
				class Foo<T> {}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo<string>, Foo<string>>(() => new Foo<string>());
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(() => new Foo(), { identifier: \`IFoo\` });
			`)
	);
});

test("When registering a service, the type arguments should be irrelevant. #3", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo<T> {
				  foo: {bar: T};
				}
				class Foo<T> {
					bar: T;
				}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo<string>["foo"], Foo<string>>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
      class Foo {${semver.gte(typescript.version, "4.3.0") ? "\n\t\tbar" : ""}
      }
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`IFoo["foo"]\`, implementation: Foo });
			`)
	);
});

test("When registering a service, the type argument can be a PropertyAccessTypeNode. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				const container = new DIContainer();
				container.registerSingleton<Intl.RelativeTimeFormat, Intl.RelativeTimeFormat>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`Intl.RelativeTimeFormat\`, implementation: Intl.RelativeTimeFormat });
			`)
	);
});

test("When registering a service, the type argument can be a TypeQueryNode. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				
				const container = new DIContainer();
				container.registerSingleton<typeof foo, {}>();
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	assert.deepEqual(
		formatCode(file!.text),
		formatCode(`\
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`typeof foo\`, implementation: {} });
			`)
	);
});
