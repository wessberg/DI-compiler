import {generateTransformResult} from "./setup/setup-transform.js";
import {formatCode} from "./util/format-code.js";
import {test} from "./util/test-runner.js";
import assert from "node:assert";

test("Relevant type-only imports for DIContainer are preserved, but replaced, under verbatim module syntax. #1", ">3.7", (_, {typescript}) => {
	const {code} = generateTransformResult(
		`import {DIContainer} from "@wessberg/di";
		import type {IFoo} from "./foo";
		
		const container = new DIContainer();
		container.get<IFoo>();`,
		{
			typescript,
			compilerOptions: {
				sourceMap: false,
				verbatimModuleSyntax: true
			}
		}
	);

	assert.deepEqual(
		formatCode(code),
		formatCode(`\
		import { DIContainer } from "@wessberg/di";
		import type { IFoo } from "./foo";
		const container = new DIContainer();
		container.get<IFoo>({ identifier: "IFoo" });
		`)
	);
});
