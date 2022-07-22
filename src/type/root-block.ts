import {TS} from "./type.js";

export type RootBlock = TS.Node & {
	statements: TS.NodeArray<TS.Statement>;
};
