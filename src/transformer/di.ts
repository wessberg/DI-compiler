import {TS} from "../type/type.js";
import type {DiIsolatedModulesOptions, DiOptions} from "./di-options.js";
import {beforeTransformer} from "./before/before-transformer.js";
import {afterTransformer} from "./after/after-transformer.js";
import {getBaseVisitorContext} from "./get-base-visitor-context.js";
import { resolveOptions } from '../loader/shared.js';

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function di(options: DiOptions): TS.CustomTransformers {
	const transformOptions = <DiIsolatedModulesOptions> resolveOptions(options.typescript ?? TS);
	
	if ("program" in options) {
		options.program.identifier = transformOptions.identifier;
		options.program.diClassName = transformOptions.diClassName;
	} else {
		options.identifier = transformOptions.identifier;
		options.diClassName = transformOptions.diClassName;
	}

	const baseVisitorContext = getBaseVisitorContext(options);

	return {
		before: [beforeTransformer(baseVisitorContext)],
		after: baseVisitorContext.needsImportPreservationLogic ? [afterTransformer(baseVisitorContext)] : []
	};
}
