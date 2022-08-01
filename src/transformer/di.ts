import {TS} from "../type/type.js";
import {DiOptions} from "./di-options.js";
import {beforeTransformer} from "./before/before-transformer.js";
import {afterTransformer} from "./after/after-transformer.js";
import {getBaseVisitorContext} from "./get-base-visitor-context.js";

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function di(options: DiOptions): TS.CustomTransformers {
	const baseVisitorContext = getBaseVisitorContext(options);

	return {
		before: [beforeTransformer(baseVisitorContext)],
		after: baseVisitorContext.needsImportPreservationLogic ? [afterTransformer(baseVisitorContext)] : []
	};
}
