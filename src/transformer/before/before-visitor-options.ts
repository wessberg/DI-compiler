import { TS } from "../../type/type";
import { VisitorOptions } from "../visitor-options";
import { ImportedSymbol } from "../../type/imported-symbol";

export interface BeforeVisitorOptions<T extends TS.Node>
  extends VisitorOptions<T> {
  requireImportedSymbol(importedSymbol: ImportedSymbol): void;
  addTslibDefinition(): void;
}
