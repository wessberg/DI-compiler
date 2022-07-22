import {TS} from "../type/type.js";
import {DiOptions} from "./di-options.js";
import {BaseVisitorContext} from "./visitor-context.js";
import {evaluate} from "ts-evaluator";
import * as TSModule from "typescript";
import {beforeTransformer} from "./before/before-transformer.js";
import {afterTransformer} from "./after/after-transformer.js";

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function di({typescript = TSModule, ...rest}: DiOptions): TS.CustomTransformers {
	// Prepare a VisitorContext
	const visitorContextShared = {
		sourceFileToAddTslibDefinition: new Map(),
		sourceFileToRequiredImportedSymbolSet: new Map()
	};

	let visitorContext: BaseVisitorContext;

	if ("program" in rest) {
		const typeChecker = rest.program.getTypeChecker();
		const compilerOptions = rest.program.getCompilerOptions();
		visitorContext = {
			...rest,
			...visitorContextShared,
			typescript,
			typeChecker,
			compilerOptions,
			evaluate: node =>
				evaluate({
					node,
					typeChecker,
					typescript
				})
		};
	} else {
		// Make sure that we have something to match on
		if (rest.match == null) {
			throw new ReferenceError(`You must pass one or more strings and/or RegExps as the 'match' option when you don't pass a Program.`);
		}
		visitorContext = {
			...rest,
			...visitorContextShared,
			typescript,
			compilerOptions: rest.compilerOptions ?? typescript.getDefaultCompilerOptions(),
			evaluate: node =>
				evaluate({
					node,
					typescript
				})
		};
	}

	return {
		before: [beforeTransformer(visitorContext)],
		after: [afterTransformer(visitorContext)]
	};
}
