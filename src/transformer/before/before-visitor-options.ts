import type {TS} from "../../type/type.js";
import type {VisitorOptions} from "../visitor-options.js";
import type {ImportedSymbol} from "../../type/imported-symbol.js";

export interface BeforeVisitorOptions<T extends TS.Node> extends VisitorOptions<T> {
	requireImportedSymbol: (importedSymbol: ImportedSymbol) => void;
	addTslibDefinition: () => void;
}
