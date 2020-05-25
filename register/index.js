/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { di } = require("../dist/cjs/index");

require("ts-node").register({
  transpileOnly: false,
  transformers: (program) => di({ program }),
});
