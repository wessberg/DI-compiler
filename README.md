# DI-Compiler (The compiler for [DI](https://www.npmjs.com/package/@wessberg/di))
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/di-compiler

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Fdi-compiler.svg

## Installation
Simply do: `npm install @wessberg/di-compiler`.

## Usage
```typescript
import {compile, getIntro} from "@wessberg/di-compiler";

// The 'compile' method will upgrade all service registrations and 'get' calls
// throughout the code
const compiled = compile(
	"a_file.ts", `
	class Foo implements IFoo {}
	DIContainer.registerSingleton<IFoo, Foo>();
	`);

// The intro is a map between interface names and the constructor arguments
// of their concrete implementations. Should only be injected once in your code
// and at best in top of your bundle.
const intro = getIntro();
```

If you are using [Rollup](https://github.com/rollup/rollup), then use [rollup-plugin-di](https://github.com/wessberg/rollup-plugin-di) to compile your code automatically as part of your bundle, rather than using this compiler.