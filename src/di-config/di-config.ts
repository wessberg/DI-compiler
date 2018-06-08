import {IDIConfig} from "./i-di-config";
import {CONSTRUCTOR_ARGUMENTS_IDENTIFIER} from "@wessberg/di";

export const diConfig: IDIConfig = {
	argumentsProperty: CONSTRUCTOR_ARGUMENTS_IDENTIFIER,
	noInjectName: "noInject",
	serviceContainerName: "DIContainer",
	registerSingletonName: "registerSingleton",
	registerTransientName: "registerTransient",
	hasName: "has",
	getName: "get"
};