import {ClassDeclaration, ClassExpression} from "typescript";
import {IGetConstructorArgumentsResult} from "./i-get-constructor-arguments-result";

export interface IConstructorArgumentService {
	getConstructorArguments (classDeclaration: ClassDeclaration|ClassExpression): IGetConstructorArgumentsResult|undefined;
}