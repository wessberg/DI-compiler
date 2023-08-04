import {generateCustomTransformerResult} from "./setup/setup-custom-transformer.js";
import {formatCode} from "./util/format-code.js";
import semver from "semver";
import {test} from "./util/test-runner.js";

test("Can parse constructor parameters and extend with an internal static class member. #1", "*", (t, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				interface IFoo {}
				class Foo {
					constructor (private foo: IFoo) {}
				}
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;
	t.deepEqual(
		formatCode(file.text),
		formatCode(`\
			class Foo {${semver.gte(typescript.version, "4.3.0") ? `\n\t\tfoo;` : ""}
				constructor(foo) {
					this.foo = foo;
				}
				static get [Symbol.for("___CTOR_ARGS___")]() { return [\`IFoo\`]; }
			}
			`)
	);
});

test("Can parse constructor parameters and extend with an internal static class member. #2", "*", (t, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				interface IFoo {}
				class Foo {
					constructor (private foo: IFoo = {}, private bar) {}
				}
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;
	t.deepEqual(
		formatCode(file.text),
		formatCode(`\
			class Foo {${semver.gte(typescript.version, "4.3.0") ? `\n\t\tfoo;\n\t\tbar;` : ""}
				constructor(foo = {}, bar) {
					this.foo = foo;
					this.bar = bar;
				}
				static get [Symbol.for("___CTOR_ARGS___")]() { return [\`IFoo\`, undefined]; }
			}
			`)
	);
});

test("When declaring service dependencies via constructor arguments, their type arguments should be irrelevant. #1", "*", (t, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
          interface IFoo<T> {}
          class Foo {
            constructor (private foo: IFoo<string>) {}
          }
			`
			}
		],
		{typescript, useProgram}
	);
	const [file] = bundle;

	t.deepEqual(
		formatCode(file.text),
		formatCode(`\
      class Foo {${semver.gte(typescript.version, "4.3.0") ? `\n\t\tfoo;` : ""}
          constructor(foo) {
              this.foo = foo;
          }
          static get [Symbol.for("___CTOR_ARGS___")]() { return [\`IFoo\`]; }
      }
			`)
	);
});
