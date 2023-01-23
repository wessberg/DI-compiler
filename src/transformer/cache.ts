import fs from "fs";
import path from "path";
import os from "os";
import {NOOP} from "../util/util.js";

/**
 * This implementation is very closely inspired by that found in https://github.com/esbuild-kit/core-utils.
 */

const DEFAULT_TTL_DAYS = 7;
const DEFAULT_TTL = 60 * 60 * 24 * DEFAULT_TTL_DAYS * 1000;

interface FileCacheEntry {
	time: number;
	key: string;
	fileName: string;
}

interface FileCacheOptions {
	cacheName: string;
	ttl: number;
}

export class FileCache<T> extends Map<string, T> {
	private readonly cacheFiles: FileCacheEntry[] = [];
	private readonly options: FileCacheOptions;

	constructor({cacheName = "di-compiler", ttl = DEFAULT_TTL}: Partial<FileCacheOptions> = {}) {
		super();

		this.options = {cacheName, ttl};

		// Initialize the disk cache
		fs.mkdirSync(this.cacheDirectory, {recursive: true});
		this.cacheFiles = fs.readdirSync(this.cacheDirectory).map(fileName => {
			const [time, key] = fileName.split("-");
			return {
				time: Number(time),
				key,
				fileName
			};
		});

		setImmediate(() => this.expireDiskCache());
	}

	private get cacheDirectory() {
		return path.join(os.tmpdir(), this.options.cacheName);
	}

	private readTransformResult(filePath: string): T | undefined {
		try {
			const jsonString = fs.readFileSync(filePath, "utf8");
			return JSON.parse(jsonString) as T;
		} catch {
			return undefined;
		}
	}

	get(key: string) {
		const memoryCacheHit = super.get(key);

		if (memoryCacheHit != null) {
			return memoryCacheHit;
		}

		const diskCacheHit = this.cacheFiles.find(cache => cache.key === key);
		if (diskCacheHit == null) {
			return;
		}

		const cacheFilePath = path.join(this.cacheDirectory, diskCacheHit.fileName);
		const cachedResult = this.readTransformResult(cacheFilePath);

		if (cachedResult == null) {
			// Remove broken cache file
			fs.promises.unlink(cacheFilePath).then(() => {
				const index = this.cacheFiles.indexOf(diskCacheHit);
				this.cacheFiles.splice(index, 1);
			}, NOOP);
			return;
		}

		// Load it into memory
		super.set(key, cachedResult);

		return cachedResult;
	}

	set(key: string, value: T) {
		super.set(key, value);

		if (value != null) {
			const time = Date.now();

			fs.promises.writeFile(path.join(this.cacheDirectory, `${time}-${key}`), JSON.stringify(value)).catch(NOOP);
		}

		return this;
	}

	expireDiskCache() {
		const time = Date.now();

		for (const cache of this.cacheFiles) {
			// Remove if older than ~7 days
			if (time - cache.time > this.options.ttl) {
				fs.promises.unlink(path.join(this.cacheDirectory, cache.fileName)).catch(NOOP);
			}
		}
	}
}
