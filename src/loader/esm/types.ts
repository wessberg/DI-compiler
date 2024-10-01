import type {MessagePort} from "node:worker_threads";
import type {TransformOptions} from "../../transformer/transform-options.js";
import type {TS} from "../../type/type.js";

export interface InitializationOptions {
	port: MessagePort;
	transformOptions?: Partial<TransformOptions>;
	typescript?: typeof TS;
}
