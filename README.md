<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/di-compiler/master/documentation/asset/di-logo.png" height="150"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A Custom Transformer for Typescript that enables compile-time Dependency Injection

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fdi-compiler?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fdi-compiler.svg"    /></a>
<a href="https://www.npmjs.com/package/%40wessberg%2Fdi-compiler"><img alt="NPM version" src="https://badge.fury.io/js/%40wessberg%2Fdi-compiler.svg"    /></a>
<img alt="Dependencies" src="https://img.shields.io/librariesio/github/wessberg%2Fdi-compiler.svg"    />
<a href="https://github.com/wessberg/di-compiler/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fdi-compiler.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

This library enables you to use [the DI library](https://github.com/wessberg/di) by providing several ways to transform your source code into a representation that it expects.
You can use it as a [Node.js loader](#usage-as-a-nodejs-loader), as [an API](#usage-as-an-api), and even as a [`Custom Transformer`](#usage-as-a-typescript-custom-transformer) for Typescript.

Integration with popular tools such as Webpack, esbuild, Rollup, or something else is easy, and this README provides several examples of ways it can be achieved.

It is optimized for _performance_, but how fast it can go depends on your setup. Please see the [Optimization](#optimization) section for details on how to tweak `DI-Compiler`
so that it works most efficiently.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- Really lightweight
- Really fast
- Low-level implementation that can be used as the foundation for other tools such as Loaders, Plugins, and others.
- It doesn't ask you to reflect metadata or to annotate your classes with decorators. "It just works".
- Works without a TypeScript program, so you can use it with tools like babel, esbuild, and SWC for the best possible performance.

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

### Patreon

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Patrons on Patreon" src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dwessberg%26type%3Dpatrons"  width="200"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Backers](#backers)
  - [Patreon](#patreon)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [npm](#npm)
  - [Yarn](#yarn)
  - [pnpm](#pnpm)
  - [Peer Dependencies](#peer-dependencies)
- [Usage](#usage)
  - [Usage as an API](#usage-as-an-api)
  - [Usage as a Node.js loader](#usage-as-a-nodejs-loader)
  - [Loader SourceMaps](#loader-sourcemaps)
  - [Loader caching](#loader-caching)
  - [Customizing DI-Compiler when used as a loader](#customizing-di-compiler-when-used-as-a-loader)
  - [Usage as a TypeScript Custom Transformer](#usage-as-a-typescript-custom-transformer)
  - [Usage with TypeScript's Compiler APIs](#usage-with-typescripts-compiler-apis)
  - [Usage with ts-nodes programmatic API](#usage-with-ts-nodes-programmatic-api)
  - [Usage with Rollup](#usage-with-rollup)
    - [Usage with @rollup/plugin-typescript](#usage-with-rollupplugin-typescript)
  - [Usage with Webpack](#usage-with-webpack)
    - [Usage with awesome-typescript-loader](#usage-with-awesome-typescript-loader)
    - [Usage with ts-loader](#usage-with-ts-loader)
- [Options](#options)
- [Optimization](#optimization)
  - [Optimization 1: Activate `preserveValueImports` in your tsconfig CompilerOptions](#optimization-1-activate-preservevalueimports-in-your-tsconfig-compileroptions)
  - [Optimization 2: Pass in one or more identifiers to consider instances of DIContainer instead of relying on partial evaluation](#optimization-2-pass-in-one-or-more-identifiers-to-consider-instances-of-dicontainer-instead-of-relying-on-partial-evaluation)
- [Contributing](#contributing)
- [FAQ](#faq)
  - [DI-Compiler doesn't correctly update all my calls to the DIContainer methods](#di-compiler-doesnt-correctly-update-all-my-calls-to-the-dicontainer-methods)
  - [How does it work, exactly?](#how-does-it-work-exactly)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### npm

```
$ npm install @wessberg/di-compiler
```

### Yarn

```
$ yarn add @wessberg/di-compiler
```

### pnpm

```
$ pnpm add @wessberg/di-compiler
```

### Peer Dependencies

`@wessberg/di-compiler` depends on `typescript`, so you need to manually install this as well.

You may also need to install `pirates` depending on the features you are going to use. Refer to the documentation for the specific cases where it may be relevant.

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

There are multiple ways you can use DI-compiler, depending on your setup:

- [As an API](#usage-as-an-api)
- [As a TypeScript Custom Transformer](#usage-as-a-typescript-custom-transformer)
- [As a modern Node.js loader](#usage-as-a-nodejs-loader)

### Usage as an API

The simplest possible way to use DI-Compiler is with its `transform` function:

```ts
import {transform} from "@wessberg/di-compiler";
const {code} = transform(`\
	import {DIContainer} from "@wessberg/di";
	const container = new DIContainer();
	class Foo {}
	container.registerSingleton<Foo>();
`);
```

In this example, the compiler knows that `container` is an instance of [DIContainer](https://github.com/wessberg/di) based on the source text. However, you may be importing an instance of DIContainer
from another file, in which case the compiler may not be able to statically infer that an identifier is an instance of DIContainer. For example:

```ts
transform(`\
	import {container} from "./services";
	// There may not be a way to statically determine whether or
	// not \`container\` is an instance of DIContainer at this point
	container.get<Foo>();
`);
```

To help the compiler out, and to improve performance, you can pass in one or more identifiers in the source text that should be considered instances of DIContainer:

```ts
transform(
	`\
	import {container} from "./services";
	container.get<Foo>();
`,
	{
		// Treat identifiers named `container` as instances of DIContainer
		identifier: "container"
	}
);
```

If you want a source map to be generated, make sure to pass that option in as a TypeScript [CompilerOption](https://www.typescriptlang.org/tsconfig#sourceMap):

```ts
const {code, map} = transform(`...`, {
	compilerOptions: {
		sourceMap: true
	}
});
```

You can pass in a cache to use as an option. This must be a data structure that conforms to that of a standard JavaScript [Map data structure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):

```ts
import {transform, type TransformResult} from "@wessberg/di-compiler";
const cache = new Map<string, TransformResult>();

transform(`...`, {
	cache
});
```

### Usage as a Node.js loader

A very convenient way to use `DI-Compiler` is as a loader directly with Node.js.

If your codebase is based on **native ESM**, and **if you use Node.js v.18.6.0 or newer**, pass it as a loader via the command line

```
node --import @wessberg/di-compiler/loader
```

This is not enough on its own to teach Node.js to understand TypeScript syntax, so you'll still need to couple it with a loader like [`ts-node`](https://github.com/TypeStrong/ts-node), [`tsx`](https://github.com/esbuild-kit/tsx) or [`esm-loader`](https://github.com/esbuild-kit/esm-loader).

For example, here's how to use it with the native ESM loader for [`ts-node`](https://github.com/TypeStrong/ts-node):

```
node --import @wessberg/di-compiler/loader --import ts-node/esm
```

And, here's how to use it with [`tsx`](https://github.com/esbuild-kit/tsx):

```
node --import @wessberg/di-compiler/loader --import tsx
```

Finally, here's how you can use it with [`esm-loader`](https://github.com/esbuild-kit/esm-loader):

```
node --import @wessberg/di-compiler/loader --import @esbuild-kit/esm-loader
```

Alternatively, if you don't use ESM in your project, or if you're running an older version of Node.js, DI-Compiler can be used as a loader too.
For example, here's how to use it in combination with [`ts-node`](https://github.com/TypeStrong/ts-node) in a CommonJS project:

```
node -r @wessberg/di-compiler/loader -r ts-node
```

> In all of the above configurations, for both ESM and CommonJS loaders, there is no TypeScript _Program_ context, nor is there a Type checker, so `DI-Compiler` will attempt to determinate programmatically whether or not the identifiers across your files reference instances of `DIContainer` or not, by performing partial evaluation on compile time. Please see the [Optimization](#optimization) section for details on how this process can be optimized.

### Loader SourceMaps

By default, SourceMaps will be generated and inlined inside the loaded modules if the `sourceMap` option is `true` inside the resolved tsconfig.

### Loader caching

By default, DI-Compiler maintains a disk cache of transformation results from previously evaluated files. That means that successive loads of the same files will
be extremely fast.

### Customizing DI-Compiler when used as a loader

You can pass in a few options to DI-Compiler via command line options:

| Environment Variable        | Description                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `DI_COMPILER_TSCONFIG_PATH` | The path to the `tsconfig.json` file to use                                                                                 |
| `DI_COMPILER_IDENTIFIER`    | A comma-separated list of identifiers that should be considered instances of DIContainer when transforming the source files |
| `DI_COMPILER_DISABLE_CACHE` | If set, no disk caching will be used.                                                                                       |

Alternatively, you can add a `di` property to your `tsconfig` where you can customize its behavior without setting environment variables:

```js
// Inside your tsconfig.json
{
	"di": {
		"identifier": "container",
		"disableCache": false
	},
	"compilerOptions": {
		// ...
	}
}
```

### Usage as a TypeScript Custom Transformer

You can use the DI-Compiler anywhere TypeScript [`Custom Transformers`](https://github.com/Microsoft/TypeScript/pull/13940) can be used.
One advantage of this approach is that you often have access to a TypeScript _Program_, which can be leveraged by the DI-Compiler to fully understand
the structure of your program and specifically the type hierarchy and whether or not an identifier is an instance of [DIContainer](https://github.com/wessberg/di), for example.

A few examples of ways to use DI-Compiler as a Custom Transformer include:

- [With TypeScript's Compiler APIs](#usage-with-typescripts-compiler-apis)
- [With ts-nodes programmatic API](#usage-with-ts-nodes-programmatic-api)
- [With Rollup](#usage-with-rollup)

### Usage with TypeScript's Compiler APIs

There's several ways to do this, but here's a simple example:

```typescript
import {createProgram, getDefaultCompilerOptions, createCompilerHost} from "typescript";
import {di} from "@wessberg/di-compiler";

const compilerOptions = getDefaultCompilerOptions();
const compilerHost = createCompilerHost(compilerOptions);

// Create a Typescript program
const program = createProgram(["my-file-1.ts", "my-file-2.ts"], compilerOptions, compilerHost);

// Transform the SourceFiles within the program, and pass them through the 'di' transformer
program.emit(undefined, undefined, undefined, undefined, di({program}));
```

### Usage with ts-nodes programmatic API

[`ts-node`](https://github.com/TypeStrong/ts-node) can also be used programmatically. Here's an example of how you may combine it with DI-Compiler:

```typescript
import {di} from "@wessberg/di-compiler";

require("ts-node").register({
	transformers: program => di({program})
});
```

### Usage with Rollup

There are a few TypeScript plugins for Rollup that support Custom Transformers, and DI-Compiler can be easily integrated with them.

#### Usage with @rollup/plugin-typescript

Here's how you may integrate DI-Compiler with [@rollup/plugin-typescript](https://www.npmjs.com/package/@rollup/plugin-typescript):

```typescript
import ts from "@rollup/plugin-typescript";
import {di} from "@wessberg/di-compiler";

export default {
	input: "...",
	output: [
		/* ... */
	],
	plugins: [
		ts({
			transformers: program => di({program})
		})
	]
};
```

### Usage with Webpack

There are two popular TypeScript loaders for Webpack that support Custom Transformers, and you can use DI-Compiler with both of them:

- [With awesome-typescript-loader](#usage-with-awesome-typescript-loader)
- [With ts-loader](#usage-with-ts-loader)

#### Usage with awesome-typescript-loader

Here's how it can be used with [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader):

```typescript
import {di} from "@wessberg/di-compiler";
const config = {
	// ...
	module: {
		rules: [
			{
				// Match .mjs, .js, .jsx, and .tsx files
				test: /(\.mjs)|(\.[jt]sx?)$/,
				loader: "awesome-typescript-loader",
				options: {
					// ...
					getCustomTransformers: program => di({program})
				}
			}
		]
	}
	// ...
};
```

#### Usage with ts-loader

[ts-loader](https://github.com/TypeStrong/ts-loader) can be used in exactly the same way as `awesome-typescript-loader`:

```typescript
import {di} from "@wessberg/di";
const config = {
	// ...
	module: {
		rules: [
			{
				// Match .mjs, .js, .jsx, and .tsx files
				test: /(\.mjs)|(\.[jt]sx?)$/,
				loader: "ts-loader",
				options: {
					// ...
					getCustomTransformers: program => di({program})
				}
			}
		]
	}
	// ...
};
```

## Options

The [`transform`](#usage-as-an-api) function, as well as the [`di` Custom Transformer](#usage-as-a-typescript-custom-transformer) takes
the same set of base options to configure tehir behavior. All of these options are optional:

| Option            | Type                       | Description                                                                                                                                                                                       |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `program`         | TypeScript Program         | A full TypeScript program. When given, a Typechecker will be used to understand the type hierarchy of the application and to determine whether or not identifiers are instances of `DIContainer`. |
| `typescript`      | TypeScript module          | If given, the TypeScript version to use internally for all operations.                                                                                                                            |
| `identifier`      | `string[]` or `string`     | One or more identifiers in the source text that should be considered instances of DIContainer. Note: If a Program is passed, this option will be ignored.                                         |
| `compilerOptions` | TypeScript CompilerOptions | A TypeScript [Compiler Options](https://www.typescriptlang.org/tsconfig) record. Note: If a Program is passed, this option will be ignored.                                                       |

## Optimization

Even though DI-Compiler is built for speed, there are ways you can speed it up significantly.

### Optimization 1: Activate `preserveValueImports` in your tsconfig CompilerOptions

By default, TypeScript will discard imported bindings of value types that are unused.
This means that the following example:

```ts
import {Foo} from "./foo";
container.registerSingleton<Foo>();
```

Would actually compile into code that would crash on runtime:

```js
// Error: Foo is not defined
container.registerSingleton(undefined, {identifier: "Foo", implementation: Foo});
```

To work around this, DI-Compiler has to track the imports of the files, _and_ add them back
in after transpilation, which comes at a cost.

You can optimize this by activating the `preserveValueImports` option in your tsconfig:

```json
{
	"compilerOptions": {
		"preserveValueImports": true
	}
}
```

By doing that, you instruct TypeScript to leave unused value imports be. DI-Compiler will recognize
this and opt out of all the internal logic for adding imported bindings back in.

### Optimization 2: Pass in one or more identifiers to consider instances of DIContainer instead of relying on partial evaluation

> Note: This optimization is irrelevant if a Typescript Program is passed to DI-Compiler.

As [described here](#usage-as-an-api), it may not always be possible to statically infer whether or not an identifier is in fact an instance of [DIContainer](https://github.com/wessberg/di) when DI-Compiler does not have access to a Typechecker.
Or, it may simply be slow, in case a lot of Nodes have to be visited in order to determine it.

To make it more robust and much faster simultaneously, pass in one or more identifiers as the `identifier` option that should be considered instances of DIContainer:

```ts
import {di, transform} from "@wessberg/di-compiler";

// Example when using the transform function
transform(
	`\
	import {container} from "./services";
	container.get<Foo>();
`,
	{
		// Treat identifiers named `container` as instances of DIContainer
		identifier: "container"
	}
);
```

See [this section](#customizing-di-compiler-when-used-as-a-loader) for details on how to pass the option when DI-Compiler is used as a loader.

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

#### DI-Compiler doesn't correctly update all my calls to the DIContainer methods

If you pass a Program to DI-Compiler (such as you typically do when you use it as a Custom Transformer), this means that the Typechecker wasn't able to determine that one or more identifiers in your
code was in fact instances of DIContainer. Please verify that TypeScript correctly tracks the type of the objects on which you invoke the relevant DIContainer methods.

If you _don't_ pass a Program to DI-Compiler, then you're relying on DI-Compiler being able to statically infer whether or not identifiers are instances of DIContainer without having access to multiple files
inside your application. This will very often lead to problems if you reference an instance of DIContainer from another file inside your application. To fix it, pass one or more identifiers that should be
considered instances of DIContainer as an option. Please see [this section](#optimization-2-pass-in-one-or-more-identifiers-to-consider-instances-of-dicontainer-instead-of-relying-on-partial-evaluation) for details
on how you can do that.

#### How does it work, exactly?

First, classes that are discovered as part of your Typescript program/bundle will be parsed for their constructor argument types and positions.
Then, instances of the [DIContainer](https://github.com/wessberg/di) will be discovered and their expressions will be upgraded.
For example, an expression such as:

```typescript
import {DIContainer} from "@wessberg/di";
import {MyInterface} from "./my-interface.js";
import {MyImplementation} from "./my-implementation.js";

const container = new DIContainer();
container.registerSingleton<MyInterface, MyImplementation>();
```

Will be compiled into:

```javascript
// ...
container.registerSingleton(undefined, {
	identifier: `MyInterface`,
	implementation: MyImplementation
});
```

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT ©

<!-- SHADOW_SECTION_LICENSE_END -->
