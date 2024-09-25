import path from "crosspath";
import {generateTransformResult} from "./setup/setup-transform.js";
import {formatCode} from "./util/format-code.js";
import {test} from "./util/test-runner.js";
import assert from "node:assert";

test("The transform API goes from TypeScript to TypeScript. #1", "*", (_, {typescript}) => {
	const {code} = generateTransformResult(
		`import {DIContainer} from "@wessberg/di";
		import Foo, {IFoo} from "./foo";
		
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>();`,
		{
			typescript,
			compilerOptions: {
				sourceMap: false
			}
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { DIContainer } from "@wessberg/di";
		import Foo, { IFoo } from "./foo";
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>(undefined, {
		  identifier: \`IFoo\`,
		  implementation: Foo,
		});`)
	);
});

test("The transform API goes from TypeScript to TypeScript. #2", "*", (_, {typescript}) => {
	const {code, map, filename} = generateTransformResult(
		`import {DIContainer} from "@wessberg/di";
		import Foo, {IFoo} from "./foo";
		
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>();`,
		{
			typescript,
			compilerOptions: {
				sourceMap: true
			}
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { DIContainer } from "@wessberg/di";
		import Foo, { IFoo } from "./foo";
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>(undefined, {
		  identifier: \`IFoo\`,
		  implementation: Foo,
		});
		//# sourceMappingURL=${filename}.map`)
	);

	assert(map != null);
});

test("The transform API goes from TypeScript to TypeScript. #3", "*", (_, {typescript}) => {
	const {code} = generateTransformResult(
		{
			fileName: "file.ts",
			text: `import {DIContainer} from "@wessberg/di";
		import Foo, {IFoo} from "./foo";
		
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>();`
		},
		{
			typescript,
			compilerOptions: {
				sourceMap: true,
				inlineSourceMap: true
			}
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { DIContainer } from "@wessberg/di";
		import Foo, { IFoo } from "./foo";
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>(undefined, {
		  identifier: \`IFoo\`,
		  implementation: Foo,
		});
		//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS50cyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUVoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ3BDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyx5REFBRyxDQUFDIn0=`)
	);
});

test("The transform API goes from TypeScript to TypeScript. #4", "*", (_, {typescript}) => {
	const {code, map, filename} = generateTransformResult(
		{
			fileName: `C:/foo/bar/baz.ts`,
			text: `import {DIContainer} from "@wessberg/di";
			import Foo, {IFoo} from "./foo";
			
			const container = new DIContainer();
			container.registerSingleton<IFoo, Foo>();`
		},
		{
			typescript,
			compilerOptions: {
				sourceMap: true
			}
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { DIContainer } from "@wessberg/di";
		import Foo, { IFoo } from "./foo";
		const container = new DIContainer();
		container.registerSingleton<IFoo, Foo>(undefined, {
		  identifier: \`IFoo\`,
		  implementation: Foo,
		});
		//# sourceMappingURL=${path.basename(filename)}.map`)
	);

	assert(map != null);
});

test("The transform API allows JSX code. #1", "*", (_, {typescript}) => {
	const {code} = generateTransformResult(
		{
			fileName: "file.tsx",
			text: `import {IFoo} from "./foo";
		
		const foo = container.get<IFoo>();

		return <div id="wrapper">{foo.name}</div>;`
		},
		{
			typescript,
			identifier: "container"
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { IFoo } from "./foo";
		const foo = container.get<IFoo>({ identifier: "IFoo" });
		return <div id="wrapper">{foo.name}</div>;`)
	);
});

test("The transform API allows JSX code. #2", "*", (_, {typescript}) => {
	const {code} = generateTransformResult(
		{
			fileName: "file.ts",
			text: `import {IFoo} from "./foo";

		const foo = container.get<IFoo>();

		return <div id="wrapper">{foo.name}</div>;`
		},
		{
			typescript,
			identifier: "container"
		}
	);

	assert.throws(() => formatCode(code));
});
