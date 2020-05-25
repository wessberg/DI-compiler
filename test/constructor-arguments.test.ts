import test from "ava";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";

test("Can parse constructor parameters and extend with an internal static class member. #1", (t) => {
  const bundle = generateTransformerResult([
    {
      entry: true,
      fileName: "index.ts",
      text: `
				interface IFoo {}
				class Foo {
					constructor (private foo: IFoo) {}
				}
			`,
    },
  ]);
  const [file] = bundle;
  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			class Foo {
				constructor(foo) {
					this.foo = foo;
				}
				static get [Symbol.for("___CTOR_ARGS___")]() { return ["IFoo"]; }
			}
			`)
  );
});

test("Can parse constructor parameters and extend with an internal static class member. #2", (t) => {
  const bundle = generateTransformerResult([
    {
      entry: true,
      fileName: "index.ts",
      text: `
				interface IFoo {}
				class Foo {
					constructor (private foo: IFoo = {}, private bar) {}
				}
			`,
    },
  ]);
  const [file] = bundle;
  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			class Foo {
				constructor(foo = {}, bar) {
					this.foo = foo;
					this.bar = bar;
				}
				static get [Symbol.for("___CTOR_ARGS___")]() { return ["IFoo", undefined]; }
			}
			`)
  );
});
