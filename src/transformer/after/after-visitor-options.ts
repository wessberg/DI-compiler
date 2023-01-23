import type {TS} from "../../type/type.js";
import type {VisitorOptions} from "../visitor-options.js";
import type {RootBlock} from "../../type/root-block.js";

export interface AfterVisitorOptions<T extends TS.Node> extends VisitorOptions<T> {
	defineArrayLiteralExpression: TS.ArrayLiteralExpression | undefined;
	rootBlock: RootBlock;
}
