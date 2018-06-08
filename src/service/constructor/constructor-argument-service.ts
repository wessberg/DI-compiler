import {IConstructorArgumentService} from "./i-constructor-argument-service";
import {ClassDeclaration, ClassExpression} from "typescript";
import {IGetConstructorArgumentsResult} from "./i-get-constructor-arguments-result";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";

/**
 * A service that helps with working with constructors
 */
export class ConstructorArgumentService implements IConstructorArgumentService {
	constructor (private readonly codeAnalyzer: ICodeAnalyzer) {
	}

	/**
	 * Gets the constructor arguments of the given class
	 * @param classDeclaration
	 */
	public getConstructorArguments (classDeclaration: ClassDeclaration|ClassExpression): IGetConstructorArgumentsResult|undefined {
		const ctor = this.codeAnalyzer.classService.getOwnOrInheritedConstructor(classDeclaration);
		if (ctor == null) return undefined;

		return {
			args: this.codeAnalyzer.constructorService.getNonInitializedTypeNames(ctor.constructor),
			isProtected: this.codeAnalyzer.modifierService.hasModifierWithName("protected", ctor.constructor)
		};
	}
}