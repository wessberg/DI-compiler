export interface IDIConfigDecoratorConfig {
	noInjectName: string;
}

export interface IDIConfig {
	exportName: string;
	registerTransientName: string;
	registerSingletonName: string;
	getName: string;
	hasName: string;
	interfaceConstructorArgumentsMapName: string;
	decorator: IDIConfigDecoratorConfig;
}