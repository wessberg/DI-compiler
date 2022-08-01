import path from "crosspath";
import ts from "rollup-plugin-ts";
import pkg from "./package.json" assert {type: "json"};
import {builtinModules} from "module";

const SHARED = () => ({
	plugins: [
		ts({
			tsconfig: "tsconfig.build.json"
		})
	],
	external: [...builtinModules, ...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies), ...Object.keys(pkg.peerDependencies)]
});

const SHARED_OUTPUT_OPTIONS = {
	sourcemap: true,
	hoistTransitiveImports: false,
	generatedCode: "es2015",
	compact: false,
	minifyInternalExports: false,
	manualChunks: id => (path.normalize(id).includes(`/src/transformer`) ? `common` : undefined)
};

export default [
	{
		input: {
			index: "src/index.ts",
			// ESM
			loader: "src/loader/esm.ts"
		},
		output: [
			{
				dir: path.dirname(pkg.exports["."].import),
				format: "esm",
				entryFileNames: `[name].js`,
				chunkFileNames: `common/[name].js`,
				...SHARED_OUTPUT_OPTIONS
			}
		],
		...SHARED()
	},
	{
		input: {
			index: "src/index.ts",
			// CommonJS
			loader: "src/loader/cjs.ts",
			
		},
		output: [
			{
				dir: path.dirname(pkg.exports["."].require),
				format: "cjs",
				entryFileNames: `[name].cjs`,
				chunkFileNames: `common/[name].cjs`,
				...SHARED_OUTPUT_OPTIONS
			}
		],
		...SHARED()
	},
	
];
