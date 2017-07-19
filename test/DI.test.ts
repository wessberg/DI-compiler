import {test} from "ava";
import {compile} from "../src/DI";
import {diConfig} from "../src/DIConfig/DIConfig";

test("will compile without throwing exceptions. #1", t => {
	compile("a_file.ts", `
		interface IFoo {}
		interface IBar {}

		class Foo implements IFoo {
			a: string = "foo";
		}

		class Bar implements IBar {
			works: boolean = false;
			constructor (private foo: IFoo, private test = 2, private foo2: IFoo) {
				this.works = foo.a != null;
			}
		}

		${diConfig.exportName}.${diConfig.registerSingletonName}<IFoo, Foo>();
		${diConfig.exportName}.${diConfig.registerSingletonName}<IBar, Bar>();
		${diConfig.exportName}.${diConfig.getName}<IBar>();
	`);

	// An exception didn't occur. Success!
	t.true(true);
});

test("will compile without throwing exceptions. #2", t => {
	compile("a_file.ts", `
		import {IFoo, Foo} from "test/Static/Service";

		${diConfig.exportName}.${diConfig.registerSingletonName}<IFoo, Foo>();
	`);

	// An exception didn't occur. Success!
	t.true(true);
});

test("will compile without throwing exceptions. #3", t => {
	compile("a_file.ts", `
		import {IFoo, Foo} from "test/Static/ReExport";

		${diConfig.exportName}.${diConfig.registerSingletonName}<IFoo, Foo>();
	`);

	// An exception didn't occur. Success!
	t.true(true);
});