import {test} from "ava";
import {compile} from "../src/DI";
import {DIConfig} from "../src/DIConfig/DIConfig";

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

		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IFoo, Foo>();
		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IBar, Bar>();
		${DIConfig.exportName}.${DIConfig.getName}<IBar>();
	`);

	// An exception didn't occur. Success!
	t.true(true);
});

test("will compile without throwing exceptions. #2", t => {
	compile("a_file.ts", `
		import {IFoo, Foo} from "test/Static/Service";

		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IFoo, Foo>();
	`);

	// An exception didn't occur. Success!
	t.true(true);
});