import {TS} from "../../type/type.js";
import {VisitorOptions} from "../visitor-options.js";
import {ImportedSymbol} from "../../type/imported-symbol.js";

export interface BeforeVisitorOptions<T extends TS.Node> extends VisitorOptions<T> {
	requireImportedSymbol(importedSymbol: ImportedSymbol): void;
	addTslibDefinition(): void;
}
