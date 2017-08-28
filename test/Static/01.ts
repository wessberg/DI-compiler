/*tslint:disable*/

import {IDIContainer} from "@wessberg/di";

interface IFoo {
	a: string;
}

interface IBar {
}

interface IBaz extends IBar {
}

declare const DIContainer: IDIContainer;

class Foo implements IFoo {
	a: string = "foo";
}

class Bar implements IBar {
	works: boolean = false;

	constructor (foo: IFoo, _test = 2, _foo2: IFoo) {
		this.works = foo.a != null;
	}
}

class Baz extends Bar implements IBaz {

}

DIContainer.registerSingleton<IFoo, Foo>(() => new Foo());
DIContainer.registerSingleton<IBar, Bar>();
DIContainer.registerSingleton<IBaz, Baz>();
DIContainer.get<IBar>();
/*tslint:enable*/