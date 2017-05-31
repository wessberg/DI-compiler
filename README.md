# DI-Compiler (The compiler for DI) [![NPM version][npm-image]][npm-url]
> The compiler for [DI](https://www.npmjs.com/package/@wessberg/di)

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

## Changelog:

**v1.0.16**:

- The DI-compiler will now skip classes that has a 'noInject' decorator.

**v1.0.15**:

- A shim for the global object will now be added before the class constructor arguments map so that `global` is defined in any environment.

**v1.0.14**:

- Bumped CodeAnalyzer dependency to ^v1.0.22.

**v1.0.13**:

- Bumped CodeAnalyzer dependency to ^v1.0.21.

**v1.0.12**:

- Fixed a bug.

**v1.0.11**:

- Built-in constructors can now be added as services too.

**v1.0.10**:

- The package began depending on 'compiler-common' rather than setting up its own blacklist filter.

**v1.0.9**:

- Bumped CodeAnalyzer dependency to ^v1.0.18
- Fixed issue where files matching *tslib* would be parsed.

**v1.0.8**:

- Bumped CodeAnalyzer dependency to ^v1.0.18

**v1.0.7**:

- The Compiler will now recursively parse all imports, rather than just one step up.
- The Compiler will now also check exports in case modules are exported from another file.

**v1.0.6**:

- The Compiler will now parse all imports for classes before proceeding.
- The Compiler will now check if another global constructor arguments map exists and assign to it if it exists instead of overwriting it.

**v1.0.5**:

- Bumped CodeAnalyzer dependency to ^v1.0.17
- Bumped DI dependency to ^v1.0.16
- `has` expressions can now be handled.

**v1.0.4**:

- Bumped CodeAnalyzer dependency to ^v1.0.11

**v1.0.3**:

- Bumped CodeAnalyzer dependency to ^v1.0.10

**v1.0.2**:

- Bumped CodeAnalyzer dependency to ^v1.0.9

**v1.0.1**:

- Fixed an issue where the found class declarations would be reset for each new file.

**v1.0.0**:

- First release.

[npm-url]: https://npmjs.org/package/@wessberg/di-compiler
[npm-image]: https://badge.fury.io/js/@wessberg/di-compiler.svg