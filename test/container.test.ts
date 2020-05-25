import test from "ava";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";
import { TYPE_NODE_CONSOLE_LOG_MARK } from "../src/transformer/constant";

test("Only considers containers that are instances of DIContainer. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);
  const [file] = bundle;

  t.deepEqual(
    formatCode(file.code),
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

test("Supports ElementAccessExpressions. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);
  const [file] = bundle;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container["registerSingleton"](undefined, { identifier: "Foo", implementation: Foo });
			`)
  );
});

test("Supports ElementAccessExpressions. #2", (t) => {
  const bundle = generateTransformerResult([
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
  ]);
  const [file] = bundle;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			const argumentExpression = "registerSingleton";
			container[argumentExpression](undefined, { identifier: "Foo", implementation: Foo });
			`)
  );
});

test("Supports PropertyAccessExpressions. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);
  const [file] = bundle;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Supports custom implementation functions. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);
  const [file] = bundle;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			import { DIContainer } from "@wessberg/di";
			const container = new DIContainer();
			container.registerSingleton(() => ({foo: "hello"}), { identifier: "IFoo" });
			`)
  );
});

test("Will remove Type node marks. #1", (t) => {
  const bundle = generateTransformerResult([
    {
      entry: true,
      fileName: "index.ts",
      text: `
				import {DIContainer} from "@wessberg/di";
				
				interface IFoo {
					foo: string;
				}
				
				const container = new DIContainer();
				container.registerSingleton<IFoo>();
			`,
    },
  ]);
  const [file] = bundle;

  t.false(formatCode(file.code).includes(TYPE_NODE_CONSOLE_LOG_MARK));
});

test("When registering a service, the implementation type argument is treated as an optional argument. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);
  const [file] = bundle;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			import { DIContainer } from "@wessberg/di";
			class Foo {
			}
			const container = new DIContainer();
			container.registerSingleton(undefined, { identifier: "Foo", implementation: Foo });
			`)
  );
});
