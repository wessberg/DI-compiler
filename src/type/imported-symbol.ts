export interface ImportedSymbolBase {
	moduleSpecifier: string;
}

export interface NamedImportedSymbol extends ImportedSymbolBase {
	isDefaultImport: boolean;
	name: string;
	propertyName: string;
}

export interface NamespaceImportedSymbol extends ImportedSymbolBase {
	isNamespaceImport: true;
	name: string;
}

export type ImportedSymbol = NamedImportedSymbol | NamespaceImportedSymbol;

/**
 * A Set of imported symbols and data about them
 */
export type ImportedSymbolSet = Set<ImportedSymbol>;

/**
 * A Map between source files and their ImportedSymbolSets
 */
export type SourceFileToImportedSymbolSet = Map<string, ImportedSymbolSet>;
