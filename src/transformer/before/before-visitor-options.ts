import { TS } from "../../type/type";
import { VisitorOptions } from "../visitor-options";

export interface BeforeVisitorOptions<T extends TS.Node>
  extends VisitorOptions<T> {
  addTrailingStatements(...statements: TS.Statement[]): void;
}
