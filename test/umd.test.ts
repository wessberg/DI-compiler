import {generateCustomTransformerResult} from "./setup/setup-custom-transformer.js";
import {formatCode} from "./util/format-code.js";
import {includeEmitHelper} from "./util/include-emit-helper.js";
import {test} from "./util/test-runner.js";
import assert from "assert";

test("UMD => Preserves Type-only imports. #1", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
			(function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const foo_1 = require("./foo");
          console.log(foo_1.default);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });

			`)
	);
});

test("UMD => Preserves type-only imports. #2", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("UMD => Preserves type-only imports. #3", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Foo });
      });
			`)
	);
});

test("UMD => Preserves type-only imports. #4", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
      });
			`)
	);
});

test("UMD => Preserves type-only imports. #5", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Bar });
      });
			`)
	);
});

test("UMD => Preserves type-only imports. #6", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("UMD => Preserves type-only imports. #7", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const foo_1 = require("./foo");
          console.log(foo_1.Bar);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.Foo });
      });
			`)
	);
});

test("UMD => Preserves type-only imports with esModuleInterop and importHelpers. #1", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo", "tslib"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("tslib").__importDefault(require("./foo"));
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });
			`)
	);
});

test("UMD => Preserves type-only imports with esModuleInterop. #1", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      ${includeEmitHelper(typescript, "__importDefault")}
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importDefault(require("./foo"));
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });

			`)
	);
});

test("UMD => Preserves type-only imports with esModuleInterop. #2", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      ${includeEmitHelper(typescript, "__importDefault")}
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importDefault(require("./foo"));
          const di_1 = require("@wessberg/di");
          const foo_1 = __importDefault(require("./foo"));
          console.log(foo_1.default);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo.default });
      });

			`)
	);
});

test("UMD => Preserves type-only imports with esModuleInterop. #3", "*", (_, {typescript, useProgram}) => {
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
				module: typescript.ModuleKind.UMD
			}
		}
	);

	const file = bundle.find(({fileName}) => fileName.includes("index.js"))!;

	assert.deepEqual(
		formatCode(file.text),
		formatCode(`\
      ${includeEmitHelper(typescript, "__importStar")}
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importStar(require("./foo"));
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: \`IFoo\`, implementation: Foo });
      });
			`)
	);
});
