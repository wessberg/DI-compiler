/*tslint:disable*/
export interface IFoo {

}

export class Foo implements IFoo {
	constructor (lolz: string = "hello") {
		console.log(lolz);
	}
}
/*tslint:enable*/