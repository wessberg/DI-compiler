/*tslint:disable*/

import {IFoo, Foo} from "./01";

interface IBar {
}

interface IBaz extends IBar {
}

declare const DIContainer: {registerSingleton<T, U> (arg?: any): void, has<T> (): boolean, get<T> (): boolean};


class Bar implements IBar {
	works: boolean = false;

	constructor (foo: IFoo, _test = 2, _foo2: IFoo) {
		this.works = foo.a != null;
	}
}

class Baz extends Bar implements IBaz {
	constructor (foo: IFoo, _test = 2, _foo2: IFoo, foo3: IBar) {
		super(foo, _test, _foo2);
		console.log(foo3);
	}

}

interface IWhatever {
	foo: string;
}

DIContainer.registerSingleton<IFoo, Foo>(() => new Foo());
DIContainer.registerSingleton<IBar, Bar>();
DIContainer.registerSingleton<IBaz, Baz>();
DIContainer.get<IBar>();
DIContainer.has<IBar>();
DIContainer.registerSingleton<IWhatever, IWhatever>(() => ({foo: "hi!"}));
// @ts-ignore
DIContainer.get({ identifier: "IBar" });
// @ts-ignore
DIContainer.registerSingleton(undefined, { identifier: "ILocativeAudioServiceImplementation", implementation: LocativeAudioServiceImplementation, constructorArguments: ["IGeolocationService", "IDeviceOrientationService", "IAudioService", "IMapsService", "IStaticConfig"] });
// @ts-ignore
DIContainer.registerSingleton(() => DecodeAudioJob, { identifier: "IDecodeAudioJobConstructor", implementation: null, constructorArguments: null });
/*tslint:enable*/