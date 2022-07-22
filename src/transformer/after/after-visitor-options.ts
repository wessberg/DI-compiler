import {TS} from "../../type/type.js";
import {VisitorOptions} from "../visitor-options.js";
import {RootBlock} from "../../type/root-block.js";

export interface AfterVisitorOptions<T extends TS.Node> extends VisitorOptions<T> {
	defineArrayLiteralExpression: TS.ArrayLiteralExpression | undefined;
	rootBlock: RootBlock;
}
