import { Expression } from "typescript";

export interface IMatchIdentifierInImportsBase {
  matched: boolean;
}

export interface INotMatchedIdentifierInImports
  extends IMatchIdentifierInImportsBase {
  matched: false;
}

export interface IMatchedIdentifierInImports
  extends IMatchIdentifierInImportsBase {
  matched: true;
  matchedIn: "name" | "namespace" | "named";
  propertyName?: string;
  name: string;
  moduleSpecifier: Expression;
}

export type MatchIdentifierInImports =
  | INotMatchedIdentifierInImports
  | IMatchedIdentifierInImports;
