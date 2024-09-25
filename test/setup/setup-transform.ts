import type {TS} from "../../src/type/type.js";
import type {DiIsolatedModulesOptions} from "../../src/transformer/di-options.js";
import {transform} from "../../src/transformer/transform.js";
import type {TransformResult} from "../../src/transformer/transform-options.js";

export interface ITestFile {
	fileName: string;
	text: string;
}

export type TestFile = ITestFile | string;

interface GenerateTransformResultOptions {
	typescript: typeof TS;
	compilerOptions?: Partial<TS.CompilerOptions>;
	stackTraceLength?: number;
	identifier?: DiIsolatedModulesOptions["identifier"];
}

interface TestTransformResult extends TransformResult {
	filename: string;
}

/**
 * Prepares a test
 */
export function generateTransformResult(
	input: TestFile,
	{typescript, compilerOptions: inputCompilerOptions, stackTraceLength, identifier}: GenerateTransformResultOptions
): TestTransformResult {
	// Optionally set the stack trace length limit
	if (stackTraceLength != null) {
		Error.stackTraceLimit = stackTraceLength;
	}

	const files: ITestFile[] = [input].map(file =>
		typeof file === "string"
			? {
					text: file,
					fileName: `auto-generated-${Math.floor(Math.random() * 100000)}.ts`,
					entry: true
				}
			: file
	);

	const [entryFile] = files;
	if (entryFile == null) {
		throw new ReferenceError("No entry file provided");
	}

	const compilerOptions: TS.CompilerOptions = {
		module: typescript.ModuleKind.ESNext,
		target: typescript.ScriptTarget.ESNext,
		sourceMap: false,
		// eslint-disable-next-line @typescript-eslint/no-deprecated, @typescript-eslint/naming-convention
		moduleResolution: (typescript.ModuleResolutionKind as {NodeNext?: TS.ModuleResolutionKind}).NodeNext ?? typescript.ModuleResolutionKind.NodeJs,
		...inputCompilerOptions
	};

	return {
		filename: entryFile.fileName,
		...transform(entryFile.text, entryFile.fileName, {
			typescript,
			compilerOptions,
			identifier
		})
	};
}
