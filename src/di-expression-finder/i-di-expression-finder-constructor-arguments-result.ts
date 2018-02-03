export interface IDIExpressionFinderConstructorArgumentsResult {
	constructorArguments: Iterable<string|undefined>;
	constructorIsProtected: boolean;
	serviceFile: string|null;
}