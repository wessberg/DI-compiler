import ts from "rollup-plugin-ts";
import pkg from "./package.json.js" assert {type: "json"};
import {builtinModules} from "module";


export default [
    {
      input: "src/index.ts",
      output: [
        {
          file: pkg.exports.require,
          format: "cjs",
          sourcemap: true,
        },
        {
          file: pkg.exports.import,
          format: "esm",
          sourcemap: true,
        },
      ],
      plugins: [
        ts({
          tsconfig: "tsconfig.build.json",
        }),
      ],
      external: [
        ...builtinModules,
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.devDependencies),
        ...Object.keys(pkg.peerDependencies),
      ],
    },
  ];
