import test from "ava";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";
import { withTypeScript } from "./util/ts-macro";
import { includeEmitHelper } from "./util/include-emit-helper";

test("Preserves Type-only imports. #1", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
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
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
			"use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const foo_1 = require("./foo");
      console.log(foo_1.default);
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
			`)
  );
});

test("Preserves type-only imports. #2", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
			`)
  );
});

test("Preserves type-only imports. #3", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
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
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.Foo });
			`)
  );
});

test("Preserves type-only imports. #4", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
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
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Preserves type-only imports. #5", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {Bar as Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Bar implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.Bar });
			`)
  );
});

test("Preserves type-only imports. #6", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {default as Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Bar implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
			`)
  );
});

test("Preserves type-only imports. #7", withTypeScript, (t, { typescript }) => {
  const bundle = generateTransformerResult(
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
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Foo implements IFoo {}
				export class Bar {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.text),
    formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("./foo");
      const di_1 = require("@wessberg/di");
      const foo_1 = require("./foo");
      console.log(foo_1.Bar);
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.Foo });
			`)
  );
});

test(
  "Preserves type-only imports with esModuleInterop and importHelpers. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
        {
          entry: true,
          fileName: "index.ts",
          text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
        },
        {
          entry: false,
          fileName: "foo.ts",
          text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
        },
      ],
      {
        typescript,
        compilerOptions: {
          esModuleInterop: true,
          importHelpers: true,
          module: typescript.ModuleKind.CommonJS,
        },
      }
    );

    const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = require("tslib").__importDefault(require("./foo"));
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
			`)
    );
  }
);

test(
  "Preserves type-only imports with esModuleInterop. #1",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
      [
        {
          entry: true,
          fileName: "index.ts",
          text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
        },
        {
          entry: false,
          fileName: "foo.ts",
          text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
        },
      ],
      {
        typescript,
        compilerOptions: {
          esModuleInterop: true,
          module: typescript.ModuleKind.CommonJS,
        },
      }
    );

    const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
      "use strict";
      ${includeEmitHelper(typescript, "__importDefault")}
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = __importDefault(require("./foo"));
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
			`)
    );
  }
);

test(
  "Preserves type-only imports with esModuleInterop. #2",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
			`,
        },
        {
          entry: false,
          fileName: "foo.ts",
          text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
        },
      ],
      {
        typescript,
        compilerOptions: {
          esModuleInterop: true,
          module: typescript.ModuleKind.CommonJS,
        },
      }
    );

    const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
      "use strict";
      ${includeEmitHelper(typescript, "__importDefault")}
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = __importDefault(require("./foo"));
      const di_1 = require("@wessberg/di");
      const foo_1 = __importDefault(require("./foo"));
      console.log(foo_1.default);
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
			`)
    );
  }
);

test(
  "preserves type-only imports with esmoduleinterop. #3",
  withTypeScript,
  (t, { typescript }) => {
    const bundle = generateTransformerResult(
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
      {
        typescript,
        compilerOptions: {
          esModuleInterop: true,
          module: typescript.ModuleKind.CommonJS,
        },
      }
    );

    const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;
    t.deepEqual(
      formatCode(file.text),
      formatCode(`\
      "use strict";
      ${includeEmitHelper(typescript, "__importStar")}
      Object.defineProperty(exports, "__esModule", { value: true });
      const Foo = __importStar(require("./foo"));
      const di_1 = require("@wessberg/di");
      const container = new di_1.DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
    );
  }
);
