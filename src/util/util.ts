import type {Nullable} from "helpertypes";
import crypto from "crypto";

/**
 * Ensures that the given item is an array
 */
export function ensureArray<T>(item: T[] | T): T[] {
	return Array.isArray(item) ? item : [item];
}

/**
 * Converts the given string to a boolean
 */
export function booleanize(str: string | boolean | undefined): boolean {
	if (str == null) return false;
	if (typeof str === "boolean") return str;

	if (isTrueLike(str)) {
		return true;
	} else if (isFalseLike(str)) {
		return false;
	} else {
		return Boolean(str);
	}
}

export function isTrueLike(str: Nullable<string | boolean>): boolean {
	if (typeof str === "boolean") return str === true;
	if (str == null) return false;

	switch (str.toLowerCase().trim()) {
		case "true":
		case "yes":
		case "1":
		case "":
			return true;

		default:
			return false;
	}
}

export function isFalseLike(str: Nullable<string | boolean>): boolean {
	if (typeof str === "boolean") return str === false;
	if (str == null) return true;

	switch (str.toLowerCase().trim()) {
		case "false":
		case "no":
		case "0":
			return true;

		default:
			return false;
	}
}

export const sha1 = (data: string) => crypto.createHash("sha1").update(data).digest("hex");
export const NOOP = () => {
	// Noop
};
