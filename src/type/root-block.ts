import { TS } from "./type";

export type RootBlock = TS.Node & {
  statements: TS.NodeArray<TS.Statement>;
};
