import Module from "node:module";
import {MessageChannel} from "node:worker_threads";
import type {InitializationOptions} from "./types.js";

export function register() {
	process.setSourceMapsEnabled(true);

	const {port1, port2} = new MessageChannel();
	port1.unref();

	Module.register(
		// Load new copy of loader so it can be registered multiple times
		`./hooks/index.js`,
		{
			parentURL: import.meta.url,
			data: {port: port2} satisfies InitializationOptions,
			transferList: [port2]
		}
	);

	port1.postMessage({stderrIsTTY: !!process.stderr.isTTY});
}
