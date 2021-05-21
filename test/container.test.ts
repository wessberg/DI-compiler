import test from "ava";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";
import { withTypeScript } from "./util/ts-macro";
import { gte } from "semver";

test(
  "Only considers containers that are instances of DIContainer. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
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
  }
);

test(
  "Supports ElementAccessExpressions. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
        {
          entry: true,
          fileName: "index.ts",
          text: `
				import {DIContainer} from "@wessberg/di";
				class Foo {}
				const container = new DIContainer();

				container["registerSingleton"]<Foo>();
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container["registerSingleton"](undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
    );
  }
);

test(
  "Supports ElementAccessExpressions. #2",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			const argumentExpression = "registerSingleton";
			container[argumentExpression](undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
    );
  }
);

test(
  "Supports PropertyAccessExpressions. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
    );
  }
);

test(
  "Won't include imports multiple times when the same implementation is registered multiple times. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
        {
          entry: false,
          fileName: "foo.ts",
          text: `
				export interface IFoo {}
				export class Foo implements IFoo {}
			`,
        },
      ],
      { typescript }
    );
    const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { Foo } from "./foo";
      import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
      container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
    );
  }
);

test(
  "Supports custom implementation functions. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			const container = new DIContainer();
			container.registerSingleton(() => ({foo: "hello"}), { identifier: \`IFoo\` });
			`)
    );
  }
);

test(
  "When registering a service, the implementation type argument is treated as an optional argument. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
        {
          entry: true,
          fileName: "index.ts",
          text: `
				import {DIContainer} from "@wessberg/di";
				
				class Foo {}
				
				const container = new DIContainer();
				container.registerSingleton<Foo>();
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`Foo\`, implementation: Foo });
			`)
    );
  }
);

test(
  "When registering a service, the type arguments should be irrelevant. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
			`)
    );
  }
);

test(
  "When registering a service, the type arguments should be irrelevant. #2",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(() => new Foo(), { identifier: \`IFoo\` });
			`)
    );
  }
);

test(
  "When registering a service, the type arguments should be irrelevant. #3",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
      class Foo {${gte(typescript.version, "4.3.0") ? "\n\t\tbar" : ""}
      }
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`IFoo["foo"]\`, implementation: Foo });
			`)
    );
  }
);

test(
  "When registering a service, the type argument can be a PropertyAccessTypeNode. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
        {
          entry: true,
          fileName: "index.ts",
          text: `
				import {DIContainer} from "@wessberg/di";
				
				const container = new DIContainer();
				container.registerSingleton<Intl.RelativeTimeFormat, Intl.RelativeTimeFormat>();
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`Intl.RelativeTimeFormat\`, implementation: Intl.RelativeTimeFormat });
			`)
    );
  }
);

test(
  "When registering a service, the type argument can be a TypeQueryNode. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
        {
          entry: true,
          fileName: "index.ts",
          text: `
				import {DIContainer} from "@wessberg/di";
				
				const container = new DIContainer();
				container.registerSingleton<typeof foo, {}>();
			`,
        },
      ],
      { typescript }
    );
    const [file] = bundle;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: \`typeof foo\`, implementation: {} });
			`)
    );
  }
);
