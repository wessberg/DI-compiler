import { NodeArray, Statement } from "typescript";
import { TS } from "./type";

export type RootBlock = TS.Node & {
  statements: NodeArray<Statement>;
};
