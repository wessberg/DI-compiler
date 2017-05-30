export interface IFoo {

}

export class Foo implements IFoo {
	constructor (lolz: string = "hello") {
		console.log(lolz);
	}
}