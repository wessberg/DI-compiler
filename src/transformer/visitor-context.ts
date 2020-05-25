import { DiOptions } from "./di-options";
import { TS } from "../type/type";
import { EvaluateResult } from "@wessberg/ts-evaluator";

export interface VisitorContext extends Required<DiOptions> {
  typeChecker: TS.TypeChecker;
  evaluate(node: TS.Declaration | TS.Expression | TS.Statement): EvaluateResult;
}
