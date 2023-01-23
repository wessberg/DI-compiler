/* eslint-disable @typescript-eslint/naming-convention */
import type {DiOptions} from "./di-options.js";
import type {BaseVisitorContext} from "./visitor-context.js";
import {evaluate} from "ts-evaluator";
import TSModule from "typescript";
import {DI_CONTAINER_NAME} from "./constant.js";
import {needsImportPreservationLogic} from "../util/ts-util.js";

/**
 * Shim the @wessberg/di module
 */
const EVALUATE_MODULE_OVERRIDES = {
	"@wessberg/di": {
		[DI_CONTAINER_NAME]: class {}
	}
};

export function getBaseVisitorContext({typescript = TSModule, ...rest}: DiOptions = {}): BaseVisitorContext {
	// Prepare a VisitorContext
	const visitorContextShared = {
		sourceFileToAddTslibDefinition: new Map(),
		sourceFileToRequiredImportedSymbolSet: new Map()
	};

	if ("program" in rest) {
		const typeChecker = rest.program.getTypeChecker();
		const compilerOptions = rest.program.getCompilerOptions();
		return {
			...rest,
			...visitorContextShared,
			needsImportPreservationLogic: needsImportPreservationLogic(typescript, compilerOptions),
			typescript,
			typeChecker,
			compilerOptions,

			evaluate: node =>
				evaluate({
					node,
					typeChecker,
					typescript,
					moduleOverrides: EVALUATE_MODULE_OVERRIDES
				})
		};
	} else {
		const compilerOptions = rest.compilerOptions ?? typescript.getDefaultCompilerOptions();
		return {
			identifier: [],

			...rest,
			...visitorContextShared,
			needsImportPreservationLogic: needsImportPreservationLogic(typescript, compilerOptions),
			typescript,
			compilerOptions,

			evaluate: node =>
				evaluate({
					node,
					typescript,
					moduleOverrides: EVALUATE_MODULE_OVERRIDES
				})
		};
	}
}
