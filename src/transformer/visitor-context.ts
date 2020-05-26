import { DiOptions } from "./di-options";
import { TS } from "../type/type";
import { EvaluateResult } from "@wessberg/ts-evaluator";
import { SourceFileToImportedSymbolSet } from "../type/imported-symbol";

export interface VisitorContext extends Required<DiOptions> {
  typeChecker: TS.TypeChecker;
  evaluate(node: TS.Declaration | TS.Expression | TS.Statement): EvaluateResult;

  // Some files need to add 'tslib' to their 'define' arrays
  sourceFileToAddTslibDefinition: Map<string, boolean>;

  // We might need to add in additional ImportDeclarations for
  // things like type-only implementation arguments, but we'll need to add
  // those in an after-transformer, since we will need to check if another import
  // already exists for that binding after transpilation
  sourceFileToRequiredImportedSymbolSet: SourceFileToImportedSymbolSet;
}
