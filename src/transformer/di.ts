import { TS } from "../type/type";
import { DiOptions } from "./di-options";
import { VisitorContext } from "./visitor-context";
import { evaluate } from "@wessberg/ts-evaluator";
import * as TSModule from "typescript";
import { beforeTransformer } from "./before/before-transformer";
import { afterTransformer } from "./after/after-transformer";

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function di({
  typescript = TSModule,
  ...rest
}: DiOptions): TS.CustomTransformers {
  const typeChecker = rest.program.getTypeChecker();

  // Prepare a VisitorContext
  const visitorContext: VisitorContext = {
    ...rest,
    typescript,
    typeChecker,
    evaluate: (node) =>
      evaluate({
        node,
        typeChecker,
        typescript,
      }),
  };

  return {
    before: [beforeTransformer(visitorContext)],
    after: [afterTransformer(visitorContext)],
  };
}
