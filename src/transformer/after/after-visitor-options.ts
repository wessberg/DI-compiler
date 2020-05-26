import { TS } from "../../type/type";
import { VisitorOptions } from "../visitor-options";
import { RootBlock } from "../../type/root-block";

export interface AfterVisitorOptions<T extends TS.Node>
  extends VisitorOptions<T> {
  defineArrayLiteralExpression: TS.ArrayLiteralExpression | undefined;
  rootBlock: RootBlock;
}
