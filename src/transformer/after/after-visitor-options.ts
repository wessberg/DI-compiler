import { TS } from "../../type/type";
import { VisitorOptions } from "../visitor-options";

export interface AfterVisitorOptions<T extends TS.Node>
  extends VisitorOptions<T> {}
