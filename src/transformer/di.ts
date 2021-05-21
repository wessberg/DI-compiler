import { TS } from "../type/type";
import { DiOptions } from "./di-options";
import { BaseVisitorContext } from "./visitor-context";
import { evaluate } from "ts-evaluator";
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
  const visitorContext: BaseVisitorContext = {
    ...rest,
    typescript,
    typeChecker,
    sourceFileToAddTslibDefinition: new Map(),
    sourceFileToRequiredImportedSymbolSet: new Map(),
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
