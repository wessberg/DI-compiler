# DI-Compiler (The compiler for [DI](https://www.npmjs.com/package/@wessberg/di))
[![NPM version][npm-version-image]][npm-version-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

[dev-dependencies-url]: https://david-dm.org/wessberg/typedetector?type=dev

[dev-dependencies-image]: https://david-dm.org/hub.com/wessberg/di-compiler/dev-status.svg
[![deps][deps-image]][deps-url]

[deps-url]: https://david-dm.org/wessberg/typedetector

[deps-image]: https://david-dm.org/hub.com/wessberg/di-compiler/status.svg
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

## Changelog

<a name="1.0.37"></a>
## 1.0.37 (2017-07-28)

* 1.0.37 ([8b2ab51](https://github.com/wessberg/di-compiler/commit/8b2ab51))
* Bumped dependency on CodeAnalyzer ([48cc095](https://github.com/wessberg/di-compiler/commit/48cc095))
* Bumped version ([690cfeb](https://github.com/wessberg/di-compiler/commit/690cfeb))



<a name="1.0.36"></a>
## 1.0.36 (2017-07-28)

* 1.0.36 ([fbc00fd](https://github.com/wessberg/di-compiler/commit/fbc00fd))
* Bumped dependencies ([3184f2f](https://github.com/wessberg/di-compiler/commit/3184f2f))
* Bumped version ([9346919](https://github.com/wessberg/di-compiler/commit/9346919))
* Bumped version ([835d74e](https://github.com/wessberg/di-compiler/commit/835d74e))
* Made shimming the global object optional ([2f303f6](https://github.com/wessberg/di-compiler/commit/2f303f6))



<a name="1.0.34"></a>
## 1.0.34 (2017-07-20)

* 1.0.34 ([ac11c5b](https://github.com/wessberg/di-compiler/commit/ac11c5b))
* Bumped dependency on DI ([bf75fc1](https://github.com/wessberg/di-compiler/commit/bf75fc1))
* Bumped version ([0c87130](https://github.com/wessberg/di-compiler/commit/0c87130))



<a name="1.0.33"></a>
## 1.0.33 (2017-07-19)

* 1.0.33 ([2a6b369](https://github.com/wessberg/di-compiler/commit/2a6b369))
* Bumped version ([2c6307b](https://github.com/wessberg/di-compiler/commit/2c6307b))
* Stopped validating if constructor arguments could be found for an implementation for a service. It m ([59573f6](https://github.com/wessberg/di-compiler/commit/59573f6))



<a name="1.0.32"></a>
## 1.0.32 (2017-07-19)

* 1.0.32 ([3f05bca](https://github.com/wessberg/di-compiler/commit/3f05bca))
* Bumped dependency on DI ([1ae2966](https://github.com/wessberg/di-compiler/commit/1ae2966))
* Bumped version ([3a2c97c](https://github.com/wessberg/di-compiler/commit/3a2c97c))



<a name="1.0.31"></a>
## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.36 (2017-07-28)

* 1.0.36 ([fbc00fd](https://github.com/wessberg/di-compiler/commit/fbc00fd))
* Bumped dependencies ([3184f2f](https://github.com/wessberg/di-compiler/commit/3184f2f))
* Bumped version ([9346919](https://github.com/wessberg/di-compiler/commit/9346919))
* Bumped version ([835d74e](https://github.com/wessberg/di-compiler/commit/835d74e))
* Made shimming the global object optional ([2f303f6](https://github.com/wessberg/di-compiler/commit/2f303f6))



<a name="1.0.34"></a>
## 1.0.34 (2017-07-20)

* 1.0.34 ([ac11c5b](https://github.com/wessberg/di-compiler/commit/ac11c5b))
* Bumped dependency on DI ([bf75fc1](https://github.com/wessberg/di-compiler/commit/bf75fc1))
* Bumped version ([0c87130](https://github.com/wessberg/di-compiler/commit/0c87130))



<a name="1.0.33"></a>
## 1.0.33 (2017-07-19)

* 1.0.33 ([2a6b369](https://github.com/wessberg/di-compiler/commit/2a6b369))
* Bumped version ([2c6307b](https://github.com/wessberg/di-compiler/commit/2c6307b))
* Stopped validating if constructor arguments could be found for an implementation for a service. It m ([59573f6](https://github.com/wessberg/di-compiler/commit/59573f6))



<a name="1.0.32"></a>
## 1.0.32 (2017-07-19)

* 1.0.32 ([3f05bca](https://github.com/wessberg/di-compiler/commit/3f05bca))
* Bumped dependency on DI ([1ae2966](https://github.com/wessberg/di-compiler/commit/1ae2966))
* Bumped version ([3a2c97c](https://github.com/wessberg/di-compiler/commit/3a2c97c))



<a name="1.0.31"></a>
## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.35 (2017-07-26)

* Bumped dependencies ([3184f2f](https://github.com/wessberg/di-compiler/commit/3184f2f))
* Bumped version ([835d74e](https://github.com/wessberg/di-compiler/commit/835d74e))



<a name="1.0.34"></a>
## 1.0.34 (2017-07-20)

* 1.0.34 ([ac11c5b](https://github.com/wessberg/di-compiler/commit/ac11c5b))
* Bumped dependency on DI ([bf75fc1](https://github.com/wessberg/di-compiler/commit/bf75fc1))
* Bumped version ([0c87130](https://github.com/wessberg/di-compiler/commit/0c87130))



<a name="1.0.33"></a>
## 1.0.33 (2017-07-19)

* 1.0.33 ([2a6b369](https://github.com/wessberg/di-compiler/commit/2a6b369))
* Bumped version ([2c6307b](https://github.com/wessberg/di-compiler/commit/2c6307b))
* Stopped validating if constructor arguments could be found for an implementation for a service. It m ([59573f6](https://github.com/wessberg/di-compiler/commit/59573f6))



<a name="1.0.32"></a>
## 1.0.32 (2017-07-19)

* 1.0.32 ([3f05bca](https://github.com/wessberg/di-compiler/commit/3f05bca))
* Bumped dependency on DI ([1ae2966](https://github.com/wessberg/di-compiler/commit/1ae2966))
* Bumped version ([3a2c97c](https://github.com/wessberg/di-compiler/commit/3a2c97c))



<a name="1.0.31"></a>
## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.34 (2017-07-20)

* 1.0.34 ([ac11c5b](https://github.com/wessberg/di-compiler/commit/ac11c5b))
* Bumped dependency on DI ([bf75fc1](https://github.com/wessberg/di-compiler/commit/bf75fc1))
* Bumped version ([0c87130](https://github.com/wessberg/di-compiler/commit/0c87130))



<a name="1.0.33"></a>
## 1.0.33 (2017-07-19)

* 1.0.33 ([2a6b369](https://github.com/wessberg/di-compiler/commit/2a6b369))
* Bumped version ([2c6307b](https://github.com/wessberg/di-compiler/commit/2c6307b))
* Stopped validating if constructor arguments could be found for an implementation for a service. It m ([59573f6](https://github.com/wessberg/di-compiler/commit/59573f6))



<a name="1.0.32"></a>
## 1.0.32 (2017-07-19)

* 1.0.32 ([3f05bca](https://github.com/wessberg/di-compiler/commit/3f05bca))
* Bumped dependency on DI ([1ae2966](https://github.com/wessberg/di-compiler/commit/1ae2966))
* Bumped version ([3a2c97c](https://github.com/wessberg/di-compiler/commit/3a2c97c))



<a name="1.0.31"></a>
## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.33 (2017-07-19)

* 1.0.33 ([2a6b369](https://github.com/wessberg/di-compiler/commit/2a6b369))
* Bumped version ([2c6307b](https://github.com/wessberg/di-compiler/commit/2c6307b))
* Stopped validating if constructor arguments could be found for an implementation for a service. It m ([59573f6](https://github.com/wessberg/di-compiler/commit/59573f6))



<a name="1.0.32"></a>
## 1.0.32 (2017-07-19)

* 1.0.32 ([3f05bca](https://github.com/wessberg/di-compiler/commit/3f05bca))
* Bumped dependency on DI ([1ae2966](https://github.com/wessberg/di-compiler/commit/1ae2966))
* Bumped version ([3a2c97c](https://github.com/wessberg/di-compiler/commit/3a2c97c))



<a name="1.0.31"></a>
## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.32 (2017-07-19)

* 1.0.32 ([3f05bca](https://github.com/wessberg/di-compiler/commit/3f05bca))
* Bumped dependency on DI ([1ae2966](https://github.com/wessberg/di-compiler/commit/1ae2966))
* Bumped version ([3a2c97c](https://github.com/wessberg/di-compiler/commit/3a2c97c))



<a name="1.0.31"></a>
## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.31 (2017-07-19)

* 1.0.31 ([75af389](https://github.com/wessberg/di-compiler/commit/75af389))
* Bumped version ([1b72ade](https://github.com/wessberg/di-compiler/commit/1b72ade))
* Stopped validating if a class exists before allowing a service to be registered. The type may not be ([663a097](https://github.com/wessberg/di-compiler/commit/663a097))



<a name="1.0.30"></a>
## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.30 (2017-07-19)

* 1.0.30 ([17c4de9](https://github.com/wessberg/di-compiler/commit/17c4de9))
* Bumped dependency on DI ([cc76f7a](https://github.com/wessberg/di-compiler/commit/cc76f7a))
* Bumped version ([9aa8056](https://github.com/wessberg/di-compiler/commit/9aa8056))



<a name="1.0.29"></a>
## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.29 (2017-07-19)

* 1.0.29 ([93adaf9](https://github.com/wessberg/di-compiler/commit/93adaf9))
* Bumped version ([4c9f658](https://github.com/wessberg/di-compiler/commit/4c9f658))
* Fixed an issue in the README ([ad567f7](https://github.com/wessberg/di-compiler/commit/ad567f7))



<a name="1.0.28"></a>
## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




## 1.0.28 (2017-07-19)

* 1.0.28 ([b0b2f06](https://github.com/wessberg/di-compiler/commit/b0b2f06))
* Updated compiler to correctly understand new features of DI ([4d574f2](https://github.com/wessberg/di-compiler/commit/4d574f2))



<a name="1.0.27"></a>
## 1.0.27 (2017-07-18)

* 1.0.27 ([47eb559](https://github.com/wessberg/di-compiler/commit/47eb559))
* Updated README ([0747968](https://github.com/wessberg/di-compiler/commit/0747968))



<a name="1.0.26"></a>
## 1.0.26 (2017-07-18)

* 1.0.26 ([a397e1c](https://github.com/wessberg/di-compiler/commit/a397e1c))
* Added untracked files ([6dd0237](https://github.com/wessberg/di-compiler/commit/6dd0237))
* Bumped CodeAnalyzer dependency. Fixed an issue where super class constructor arguments wouldn't be d ([f36ef10](https://github.com/wessberg/di-compiler/commit/f36ef10))
* Update package.json ([69e74e0](https://github.com/wessberg/di-compiler/commit/69e74e0))
* Update README.md ([e782215](https://github.com/wessberg/di-compiler/commit/e782215))



<a name="1.0.25"></a>
## 1.0.25 (2017-07-06)

* 1.0.25 ([3e52902](https://github.com/wessberg/di-compiler/commit/3e52902))
* Bumped CodeAnalyzer dependency to ^v1.0.38. Added an 'excludeFiles' third (optional) argument to the ([6ab0983](https://github.com/wessberg/di-compiler/commit/6ab0983))



<a name="1.0.24"></a>
## 1.0.24 (2017-07-06)

* 1.0.24 ([399369a](https://github.com/wessberg/di-compiler/commit/399369a))
* Bumped CodeAnalyzer dependency to ^v1.0.36. ([653dbb2](https://github.com/wessberg/di-compiler/commit/653dbb2))



<a name="1.0.23"></a>
## 1.0.23 (2017-07-05)

* 1.0.23 ([eef0051](https://github.com/wessberg/di-compiler/commit/eef0051))
* Bumped CodeAnalyzer dependency to ^v1.0.34. ([f13c9b6](https://github.com/wessberg/di-compiler/commit/f13c9b6))



<a name="1.0.22"></a>
## 1.0.22 (2017-07-05)

* 1.0.22 ([353d52f](https://github.com/wessberg/di-compiler/commit/353d52f))
* Bumped CodeAnalyzer dependency to ^v1.0.33. ([b2d1ca5](https://github.com/wessberg/di-compiler/commit/b2d1ca5))



<a name="1.0.21"></a>
## 1.0.21 (2017-07-05)

* 1.0.21 ([5a254ac](https://github.com/wessberg/di-compiler/commit/5a254ac))
* Bumped CodeAnalyzer dependency to ^v1.0.32. ([5eefbfc](https://github.com/wessberg/di-compiler/commit/5eefbfc))



<a name="1.0.20"></a>
## 1.0.20 (2017-07-05)

* 1.0.20 ([c42fc59](https://github.com/wessberg/di-compiler/commit/c42fc59))
* Bumped CodeAnalyzer dependency to ^v1.0.31. ([38163f0](https://github.com/wessberg/di-compiler/commit/38163f0))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-05)

* 1.0.19 ([4db402f](https://github.com/wessberg/di-compiler/commit/4db402f))
* Bumped CodeAnalyzer dependency to ^v1.0.30. ([f47f424](https://github.com/wessberg/di-compiler/commit/f47f424))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-31)

* 1.0.18 ([e16343e](https://github.com/wessberg/di-compiler/commit/e16343e))
* Bumped CodeAnalyzer dependency to ^v1.0.25. ([211203a](https://github.com/wessberg/di-compiler/commit/211203a))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([73145f8](https://github.com/wessberg/di-compiler/commit/73145f8))
* Bumped CodeAnalyzer dependency to ^v1.0.24. ([2acffa9](https://github.com/wessberg/di-compiler/commit/2acffa9))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-31)

* 1.0.16 ([450a117](https://github.com/wessberg/di-compiler/commit/450a117))
* The DI-compiler will now skip classes that has a 'noInject' decorator. ([b20189a](https://github.com/wessberg/di-compiler/commit/b20189a))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-31)

* 1.0.15 ([9d7ea5d](https://github.com/wessberg/di-compiler/commit/9d7ea5d))
* A shim for the global object will now be added before the class constructor arguments map so that 'g ([60ac279](https://github.com/wessberg/di-compiler/commit/60ac279))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-31)

* 1.0.14 ([52c0881](https://github.com/wessberg/di-compiler/commit/52c0881))
* Bumped CodeAnalyzer dependency to ^v1.0.22. ([bf4c089](https://github.com/wessberg/di-compiler/commit/bf4c089))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-31)

* 1.0.13 ([b181554](https://github.com/wessberg/di-compiler/commit/b181554))
* Bumped CodeAnalyzer dependency to ^v1.0.21. ([9bf836b](https://github.com/wessberg/di-compiler/commit/9bf836b))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-31)

* 1.0.12 ([8ec9e54](https://github.com/wessberg/di-compiler/commit/8ec9e54))
* Fixed a bug. ([064874f](https://github.com/wessberg/di-compiler/commit/064874f))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-31)

* 1.0.11 ([80d433d](https://github.com/wessberg/di-compiler/commit/80d433d))
* Built-in constructors (for example Proxy or anything that is a native part of the environment) can n ([faaccad](https://github.com/wessberg/di-compiler/commit/faaccad))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-31)

* 1.0.10 ([dd507f7](https://github.com/wessberg/di-compiler/commit/dd507f7))
* The package began depending on 'compiler-common' rather than setting up its own blacklist filter. ([6108201](https://github.com/wessberg/di-compiler/commit/6108201))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-31)

* - Bumped CodeAnalyzer dependency to ^v1.0.18 ([32e39cf](https://github.com/wessberg/di-compiler/commit/32e39cf))
* 1.0.9 ([d811d25](https://github.com/wessberg/di-compiler/commit/d811d25))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-30)

* 1.0.8 ([d5d2677](https://github.com/wessberg/di-compiler/commit/d5d2677))
* Bumped CodeAnalyzer dependency to ^v1.0.18 ([5b3a7b0](https://github.com/wessberg/di-compiler/commit/5b3a7b0))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-30)

* - The Compiler will now recursively parse all imports, rather than just one step up. ([9ef95e9](https://github.com/wessberg/di-compiler/commit/9ef95e9))
* 1.0.7 ([6188a99](https://github.com/wessberg/di-compiler/commit/6188a99))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-30)

* - The Compiler will now parse all imports for classes before proceeding. ([ab87556](https://github.com/wessberg/di-compiler/commit/ab87556))
* 1.0.6 ([43ee330](https://github.com/wessberg/di-compiler/commit/43ee330))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-30)

* - Bumped CodeAnalyzer dependency to ^v1.0.17 ([fd046e7](https://github.com/wessberg/di-compiler/commit/fd046e7))
* 1.0.5 ([13e0373](https://github.com/wessberg/di-compiler/commit/13e0373))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-25)

* 1.0.4 ([6ae12d8](https://github.com/wessberg/di-compiler/commit/6ae12d8))
* Bumped CodeAnalyzer dependency to ^v1.0.11 ([ccc5d33](https://github.com/wessberg/di-compiler/commit/ccc5d33))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-25)

* 1.0.3 ([bbd7e77](https://github.com/wessberg/di-compiler/commit/bbd7e77))
* Bumped CodeAnalyzer dependency to ^v1.0.10 ([05cf98d](https://github.com/wessberg/di-compiler/commit/05cf98d))



<a name="1.0.2"></a>
## 1.0.2 (2017-05-24)

* 1.0.2 ([a4d4722](https://github.com/wessberg/di-compiler/commit/a4d4722))
* Bumped CodeAnalyzer dependency to ^v1.0.9 ([df814c2](https://github.com/wessberg/di-compiler/commit/df814c2))



<a name="1.0.1"></a>
## 1.0.1 (2017-05-24)

* 1.0.1 ([716937e](https://github.com/wessberg/di-compiler/commit/716937e))
* First commit ([385cd8d](https://github.com/wessberg/di-compiler/commit/385cd8d))
* Fixed an issue where the found class declarations would be reset for each new file. ([4d5966e](https://github.com/wessberg/di-compiler/commit/4d5966e))




