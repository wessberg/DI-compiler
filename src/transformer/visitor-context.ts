import {DiProgramOptions, DiIsolatedModulesOptions} from "./di-options.js";
import {TS} from "../type/type.js";
import {EvaluateResult} from "ts-evaluator";
import {SourceFileToImportedSymbolSet} from "../type/imported-symbol.js";

export interface BaseVisitorContextShared {
	compilerOptions: TS.CompilerOptions;
	evaluate(node: TS.Declaration | TS.Expression | TS.Statement): EvaluateResult;
	needsImportPreservationLogic: boolean;

	// Some files need to add 'tslib' to their 'define' arrays
	sourceFileToAddTslibDefinition: Map<string, boolean>;

	// We might need to add in additional ImportDeclarations for
	// things like type-only implementation arguments, but we'll need to add
	// those in an after-transformer, since we will need to check if another import
	// already exists for that binding after transpilation
	sourceFileToRequiredImportedSymbolSet: SourceFileToImportedSymbolSet;
}

interface BaseVisitorContextProgram extends BaseVisitorContextShared, Required<DiProgramOptions> {
	typeChecker: TS.TypeChecker;
}

interface BaseVisitorContextIsolatedModules extends BaseVisitorContextShared, Required<DiIsolatedModulesOptions> {}

export type BaseVisitorContext = BaseVisitorContextProgram | BaseVisitorContextIsolatedModules;

interface VisitorContextShared {
	factory: TS.NodeFactory;
	transformationContext: TS.TransformationContext;
}

interface VisitorContextProgram extends BaseVisitorContextProgram, VisitorContextShared {}

interface VisitorContextIsolatedModules extends BaseVisitorContextIsolatedModules, VisitorContextShared {}

export type VisitorContext = VisitorContextProgram | VisitorContextIsolatedModules;
