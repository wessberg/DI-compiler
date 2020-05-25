import { Program } from "typescript";
import { TS } from "../type/type";

export interface DiOptions {
  program: Program;
  typescript?: typeof TS;
}
