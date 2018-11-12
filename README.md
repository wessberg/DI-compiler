<img alt="Logo for @wessberg/di-compiler" src="https://raw.githubusercontent.com/wessberg/di-compiler/master/documentation/asset/di-logo.png" height="200"></img><br>
<a href="https://npmcharts.com/compare/@wessberg/di-compiler?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fdi-compiler.svg" height="20"></img></a>
<a href="https://david-dm.org/wessberg/di-compiler"><img alt="Dependencies" src="https://img.shields.io/david/wessberg/di-compiler.svg" height="20"></img></a>
<a href="https://www.npmjs.com/package/@wessberg/di-compiler"><img alt="NPM Version" src="https://badge.fury.io/js/%40wessberg%2Fdi-compiler.svg" height="20"></img></a>
<a href="https://github.com/wessberg/di-compiler/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fdi-compiler.svg" height="20"></img></a>
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"></img></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="20"></img></a>

# `@wessberg/di-compiler`

> A Custom Transformer for Typescript that enables compile-time Dependency Injection

## Description

This is a [`CustomTransformer`](https://github.com/Microsoft/TypeScript/pull/13940) for Typescript that enables you to use [the DI library](https://github.com/wessberg/di).

## Install

### NPM

```
$ npm install @wessberg/di-compiler
```

### Yarn

```
$ yarn add @wessberg/di-compiler
```

## Usage

Usage will depend on how you build your Typescript code. Unfortunately, you cannot pass Custom Transformers directly to the Command-line Compiler `tsc`.

### Usage with Rollup

The most popular Typescript plugins for Rollup supports passing in [`CustomTransformers`](https://github.com/Microsoft/TypeScript/pull/13940) which are functions that can manipulate the Typescript AST during the emit-stage.
For example, here's how to use it with [`rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts) within your Rollup configuration:

```javascript
import ts from "@wessberg/rollup-plugin-ts";
import {di} from "@wessberg/di-compiler";

export default {
	input: "...",
	output: [ /* ... */ ],
	plugins: [
		ts({
			transformers: [di]
		})
	]
}
```

### Usage with the Typescript Compiler API

There's several ways to do this, but here's a simple example:
```typescript
import {createProgram, getDefaultCompilerOptions, createCompilerHost} from "typescript";
import {di} from "@wessberg/di-compiler";

const compilerOptions = getDefaultCompilerOptions();
const compilerHost = createCompilerHost(compilerOptions);

// Create a Typescript program
const program = createProgram([
	"my-file-1.ts",
	"my-file-2.ts"
],
	compilerOptions,
	compilerHost
);

// Transform the SourceFiles within the program, and pass them through the 'di' transformer
program.emit(undefined, undefined, undefined, undefined, di({program}))
```

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

## Maintainers

- <a href="https://github.com/wessberg"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="11"></img></a> [Frederik Wessberg](https://github.com/wessberg): _Maintainer_

## FAQ

#### How does it work, exactly?

First, classes that are discovered as part of your Typescript program/bundle will be parsed for their constructor argument types and positions.
Then, instances of the [DIContainer](https://github.com/wessberg/di) will be discovered and their expressions will be upgraded.
For example, an expression such as:

```typescript
import {DIContainer} from "@wessberg/di";
import {MyInterface} from "./my-interface";
import {Myimplementation} from "./my-implementation";

const container = new DIContainer();
container.registerSingleton<MyInterface, MyImplementation>();
```

Will be compiled into:

```javascript
// ...
container.registerSingleton(undefined, {identifier: "MyInterface", implementation: MyImplementation});
```

## Backers 🏅

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, logo, and link to your site listed here.

## License 📄

MIT © [Frederik Wessberg](https://github.com/wessberg)
