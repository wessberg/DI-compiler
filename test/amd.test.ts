import {generateCustomTransformerResult} from "./setup/setup-custom-transformer.js";
import {formatCode} from "./util/format-code.js";
import {includeEmitHelper} from "./util/include-emit-helper.js";
import {test} from "./util/test-runner.js";
import assert from "node:assert";

test("AMD => Preserves Type-only imports. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				console.log(Foo);
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
			define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1, foo_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          console.log(foo_1.default);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("AMD => Preserves type-only imports. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("AMD => Preserves type-only imports. #3", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import {Foo, IFoo} from "./foo";
				
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
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Foo });
      });
			`)
	);
});

test("AMD => Preserves type-only imports. #4", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import * as Foo from "./foo";
				import {IFoo} from "./foo";
				
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
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
      });
			`)
	);
});

test("AMD => Preserves type-only imports. #5", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import {Bar as Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export class Bar implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Bar });
      });
			`)
	);
});

test("AMD => Preserves type-only imports. #6", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import {default as Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export default class Bar implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("AMD => Preserves type-only imports. #7", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import {Foo, Bar, IFoo} from "./foo";
				console.log(Bar);
				
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
				export class Bar {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1, foo_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          console.log(foo_1.Bar);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Foo });
      });
			`)
	);
});

test("AMD => Preserves type-only imports when 'preserveValueImports' is true. #1", `>=4.5`, (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import {Foo, Bar, IFoo} from "./foo";
				console.log(Bar);
				
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
				export class Bar {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				module: typescript.ModuleKind.AMD,
				preserveValueImports: true
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1, foo_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          console.log(foo_1.Bar);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Foo });
      });
			`)
	);
});

test("AMD => Preserves type-only imports with esModuleInterop and importHelpers. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				esModuleInterop: true,
				importHelpers: true,
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      define(["require", "exports", "@wessberg/di", "./foo", "tslib"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("tslib").__importDefault(require("./foo"));
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("AMD => Preserves type-only imports with esModuleInterop. #1", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				esModuleInterop: true,
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      ${includeEmitHelper(typescript, "__importDefault")}
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importDefault(require("./foo"));
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("AMD => Preserves type-only imports with esModuleInterop. #2", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				console.log(Foo);
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`
			},
			{
				entry: false,
				fileName: "foo.ts",
				text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`
			}
		],
		{
			typescript,
			useProgram,
			compilerOptions: {
				esModuleInterop: true,
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      ${includeEmitHelper(typescript, "__importDefault")}
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1, foo_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importDefault(require("./foo"));
          foo_1 = __importDefault(foo_1);
          console.log(foo_1.default);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("AMD => Preserves type-only imports with esModuleInterop. #3", "*", (_, {typescript, useProgram}) => {
	const bundle = generateCustomTransformerResult(
		[
			{
				entry: true,
				fileName: "index.ts",
				text: `
				import {DIContainer} from "@wessberg/di";
				import * as Foo from "./foo";
				import {IFoo} from "./foo";
				
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
				esModuleInterop: true,
				module: typescript.ModuleKind.AMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      ${includeEmitHelper(typescript, "__importStar")}
      define(["require", "exports", "@wessberg/di", "./foo"], function (require, exports, di_1) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importStar(require("./foo"));
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
      });
			`)
	);
});
