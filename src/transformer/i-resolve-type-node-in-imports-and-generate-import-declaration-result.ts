import { ImportDeclaration } from "typescript";

export interface IResolveTypeNodeInImportsAndGenerateImportDeclarationResult {
  importDeclaration: ImportDeclaration;
  identifierText: string;
}
