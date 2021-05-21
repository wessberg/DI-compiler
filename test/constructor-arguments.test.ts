import test from "ava";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";
import { withTypeScript } from "./util/ts-macro";
import { gte } from "semver";

test(
  "Can parse constructor parameters and extend with an internal static class member. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
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
      ],
      { typescript }
    );
    const [file] = bundle;
    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			class Foo {${gte(typescript.version, "4.3.0") ? `\n\t\tfoo;` : ""}
				constructor(foo) {
					this.foo = foo;
				}
				static get [Symbol.for("___CTOR_ARGS___")]() { return ["IFoo"]; }
			}
			`)
    );
  }
);

test(
  "Can parse constructor parameters and extend with an internal static class member. #2",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
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
      ],
      { typescript }
    );
    const [file] = bundle;
    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			class Foo {${gte(typescript.version, "4.3.0") ? `\n\t\tfoo;\n\t\tbar;` : ""}
				constructor(foo = {}, bar) {
					this.foo = foo;
					this.bar = bar;
				}
				static get [Symbol.for("___CTOR_ARGS___")]() { return ["IFoo", undefined]; }
			}
			`)
    );
  }
);
