import {IContainerService} from "./i-container-service";
import MagicString, {MagicStringOptions, OverwriteOptions} from "magic-string";
import {IPlacement} from "@wessberg/codeanalyzer";

/**
 * A class that can hold some code in a container while tracking changes
 * such that a SourceMap can be generated from the changes
 */
export class ContainerService extends MagicString implements IContainerService {

	/**
	 * The file that the contents relate to
	 * @type {string}
	 */
	public readonly file: string;

	/**
	 * Whether or not the contents of the file has changed
	 * @type {boolean}
	 */
	public hasChanged: boolean = false;

	constructor (content: string, options: MagicStringOptions) {
		super(content, options);
		this.file = options.filename;
	}

	/**
	 * Overwrites the parent's 'append' method
	 * @override
	 * @param {string} content
	 * @returns {MagicString}
	 */
	public append (content: string): MagicString {
		this.hasChanged = true;
		return super.append(content);
	}

	/**
	 * Overwrites the parent's 'appendLeft' method
	 * @override
	 * @param {number} index
	 * @param {string} content
	 * @returns {MagicString}
	 */
	public appendLeft (index: number, content: string): MagicString {
		this.hasChanged = true;
		return super.appendLeft(index, content);
	}

	/**
	 * Overwrites the parent's 'appendRight' method
	 * @override
	 * @param {number} index
	 * @param {string} content
	 * @returns {MagicString}
	 */
	public appendRight (index: number, content: string): MagicString {
		this.hasChanged = true;
		return super.appendRight(index, content);
	}

	/**
	 * Overwrites the parent's 'prepend' method
	 * @override
	 * @param {string} content
	 * @returns {MagicString}
	 */
	public prepend (content: string): MagicString {
		this.hasChanged = true;
		return super.prepend(content);
	}

	/**
	 * Overwrites the parent's 'prependLeft' method
	 * @override
	 * @param {number} index
	 * @param {string} content
	 * @returns {MagicString}
	 */
	public prependLeft (index: number, content: string): MagicString {
		this.hasChanged = true;
		return super.prependLeft(index, content);
	}

	/**
	 * Overwrites the parent's prependRight' method
	 * @override
	 * @param {number} index
	 * @param {string} content
	 * @returns {MagicString}
	 */
	public prependRight (index: number, content: string): MagicString {
		this.hasChanged = true;
		return super.prependRight(index, content);
	}

	/**
	 * Overwrites the parent's remove' method
	 * @override
	 * @param {number} start
	 * @param {number} end
	 * @returns {MagicString}
	 */
	public remove (start: number, end: number): MagicString {
		this.hasChanged = true;
		return super.remove(start, end);
	}

	/**
	 * Overwrites the parent's overwrite' method
	 * @override
	 * @param {number} start
	 * @param {number} end
	 * @param {string} content
	 * @param {boolean | OverwriteOptions} options
	 * @returns {MagicString}
	 */
	public overwrite (start: number, end: number, content: string, options?: boolean|OverwriteOptions): MagicString {
		this.hasChanged = true;
		return super.overwrite(start, end, content, options);
	}

	/**
	 * Appends the given content at a specific position
	 * @param {string} content
	 * @param {Node} node
	 * @param {"BEFORE" | "AFTER"} position
	 * @returns {MagicString}
	 */
	public appendAtPlacement (content: string, {node, position}: IPlacement): MagicString {
		this.hasChanged = true;
		switch (position) {
			case "BEFORE":
				return node == null
					? this.appendLeft(0, content)
					: this.appendLeft(node.pos, content);
			case "AFTER":
				return node == null
					? this.append(content)
					: this.appendRight(node.end, content);
		}
	}

}