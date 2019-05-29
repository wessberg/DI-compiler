<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/di-compiler/master/documentation/asset/di-logo.png" height="100"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A Custom Transformer for Typescript that enables compile-time Dependency Injection

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fdi-compiler?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fdi-compiler.svg"    /></a>
<a href="https://www.npmjs.com/package/%40wessberg%2Fdi-compiler"><img alt="NPM version" src="https://badge.fury.io/js/%40wessberg%2Fdi-compiler.svg"    /></a>
<a href="https://david-dm.org/wessberg/di-compiler"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fdi-compiler.svg"    /></a>
<a href="https://github.com/wessberg/di-compiler/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fdi-compiler.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

This is a [`CustomTransformer`](https://github.com/Microsoft/TypeScript/pull/13940) for Typescript that enables you to use [the DI library](https://github.com/wessberg/di).

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Usage](#usage)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [Backers](#backers)
  - [Patreon](#patreon)
- [FAQ](#faq)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### NPM

```
$ npm install @wessberg/di-compiler
```

### Yarn

```
$ yarn add @wessberg/di-compiler
```

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

Since this is a Custom Transformer, it can be used practically anywhere you use TypeScript.

The most obvious place would be to use it directly with Typescript's compiler APIs:

### Usage with TypeScript's Compiler APIs

There's several ways to do this, but here's a simple example:

```typescript
import {
  createProgram,
  getDefaultCompilerOptions,
  createCompilerHost
} from "typescript";
import { di } from "@wessberg/di-compiler";

const compilerOptions = getDefaultCompilerOptions();
const compilerHost = createCompilerHost(compilerOptions);

// Create a Typescript program
const program = createProgram(
  ["my-file-1.ts", "my-file-2.ts"],
  compilerOptions,
  compilerHost
);

// Transform the SourceFiles within the program, and pass them through the 'di' transformer
program.emit(undefined, undefined, undefined, undefined, di({ program }));
```

### Usage with Rollup

There are two popular TypeScript plugins for Rollup that support Custom Transformers:

- [rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts)
- [rollup-plugin-typescript2](https://github.com/ezolenko/rollup-plugin-typescript2)

#### Usage with rollup-plugin-ts

```typescript
import ts from "@wessberg/rollup-plugin-ts";
import { di } from "@wessberg/di-compiler";

export default {
  input: "...",
  output: [
    /* ... */
  ],
  plugins: [
    ts({
      transformers: [di]
    })
  ]
};
```

#### Usage with rollup-plugin-typescript2

```typescript
import ts from "rollup-plugin-typescript2";
import { di } from "@wessberg/di-compiler";

export default {
  input: "...",
  output: [
    /* ... */
  ],
  plugins: [
    ts({
      transformers: [service => di({ program: service.getProgram() })]
    })
  ]
};
```

### Usage with Webpack

There are two popular TypeScript loaders for Webpack that support Custom Transformers:

- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)
- [ts-loader](https://github.com/TypeStrong/ts-loader)

#### Usage with awesome-typescript-loader

```typescript
import { di } from "@wessberg/di-compiler";
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
          getCustomTransformers: program => di({ program })
        }
      }
    ]
  }
  // ...
};
```

#### Usage with ts-loader

```typescript
import { di } from "@wessberg/di";
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
          getCustomTransformers: program => di({ program })
        }
      }
    ]
  }
  // ...
};
```

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

## Maintainers

| <img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   />                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br><strong>Twitter</strong>: [@FredWessberg](https://twitter.com/FredWessberg)<br><strong>Github</strong>: [@wessberg](https://github.com/wessberg)<br>_Lead Developer_ |

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

### Patreon

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, avatar, and Twitter handle listed here.

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Backers on Patreon" src="https://patreon-badge.herokuapp.com/11315442.png"  width="500"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

#### How does it work, exactly?

First, classes that are discovered as part of your Typescript program/bundle will be parsed for their constructor argument types and positions.
Then, instances of the [DIContainer](https://github.com/wessberg/di) will be discovered and their expressions will be upgraded.
For example, an expression such as:

```typescript
import { DIContainer } from "@wessberg/di";
import { MyInterface } from "./my-interface";
import { Myimplementation } from "./my-implementation";

const container = new DIContainer();
container.registerSingleton<MyInterface, MyImplementation>();
```

Will be compiled into:

```javascript
// ...
container.registerSingleton(undefined, {
  identifier: "MyInterface",
  implementation: MyImplementation
});
```

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->
