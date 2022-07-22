import {DI_CONTAINER_NAME} from "../../constant.js";
import {TS} from "../../../type/type.js";
import {BeforeVisitorOptions} from "../before-visitor-options.js";
import {DiMethodKind} from "../../di-method-kind.js";
import {VisitorContext} from "../../visitor-context.js";
import {getImportDefaultHelper, getImportStarHelper, moduleKindDefinesDependencies, moduleKindSupportsImportHelpers} from "../../../util/ts-util.js";
import {pickServiceOrImplementationName} from "../util.js";
import {ensureArray} from "../../../util/util.js";

export function visitCallExpression(options: BeforeVisitorOptions<TS.CallExpression>): TS.VisitResult<TS.Node> {
	const {node, childContinuation, continuation, context, addTslibDefinition, requireImportedSymbol} = options;
	const {typescript, factory, compilerOptions, transformationContext} = context;

	const diMethod = getDiMethodKind(node.expression, context);

	if (diMethod != null) {
		switch (diMethod) {
			case "get":
			case "has": {
				// If no type arguments are given, don't modify the node at all
				if (node.typeArguments == null || node.typeArguments[0] == null) {
					return childContinuation(node);
				}

				return factory.updateCallExpression(node, node.expression, node.typeArguments, [
					factory.createObjectLiteralExpression([factory.createPropertyAssignment("identifier", factory.createStringLiteral(node.typeArguments[0].getFullText().trim()))])
				]);
			}

			case "registerSingleton":
			case "registerTransient": {
				let [typeArg, implementationArg] = (node.typeArguments ?? []) as unknown as [TS.TypeNode | undefined, TS.TypeNode | TS.Expression | undefined];

				// If not implementation is provided, use the type argument *as* the implementation
				if (implementationArg == null) {
					implementationArg = typeArg;
				}

				// If another implementation is passed, used that one instead
				if (node.arguments.length > 0) {
					implementationArg = node.arguments[0];
				}

				if (typeArg == null || implementationArg == null) {
					return childContinuation(node);
				}

				const typeArgText = pickServiceOrImplementationName(typeArg, context);
				const implementationArgText = pickServiceOrImplementationName(implementationArg, context);

				// If the Implementation is a TypeNode, and if it originates from an ImportDeclaration, it may be stripped from the file since Typescript won't Type-check the updates from
				// a CustomTransformer and such a node would normally be removed from the imports.
				// to fix it, add an ImportDeclaration if needed
				if (typescript.isTypeNode(implementationArg)) {
					const matchingImport = findMatchingImportDeclarationForIdentifier(implementationArgText, options);
					if (matchingImport != null && typescript.isStringLiteralLike(matchingImport.importDeclaration.moduleSpecifier)) {
						switch (matchingImport.kind) {
							case "default": {
								// Log a request for the __importDefault helper already if we will
								// need it in a later transformation step
								if (moduleKindSupportsImportHelpers(compilerOptions.module, typescript) && compilerOptions.esModuleInterop === true && compilerOptions.importHelpers !== true) {
									transformationContext.requestEmitHelper(getImportDefaultHelper(typescript));
								}

								// Log a request for adding 'tslib' to the define([...]) array for the current
								// module system if it relies on declaring dependencies (such as UMD, AMD, and SystemJS does)
								if (moduleKindDefinesDependencies(compilerOptions.module, typescript) && compilerOptions.esModuleInterop === true && compilerOptions.importHelpers === true) {
									addTslibDefinition();
								}

								requireImportedSymbol({
									isDefaultImport: true,
									moduleSpecifier: matchingImport.importDeclaration.moduleSpecifier.text,
									name: matchingImport.identifier.text,
									propertyName: matchingImport.identifier.text
								});
								break;
							}

							case "namedImport": {
								requireImportedSymbol({
									isDefaultImport: false,
									moduleSpecifier: matchingImport.importDeclaration.moduleSpecifier.text,
									name: matchingImport.importSpecifier.name.text,
									propertyName: matchingImport.importSpecifier.propertyName?.text ?? matchingImport.importSpecifier.name.text
								});
								break;
							}

							case "namespace": {
								// Log a request for the __importStar helper already if you will
								// need it in a later transformation step
								if (moduleKindSupportsImportHelpers(compilerOptions.module, typescript) && compilerOptions.esModuleInterop === true && compilerOptions.importHelpers !== true) {
									transformationContext.requestEmitHelper(getImportStarHelper(typescript));
								}

								requireImportedSymbol({
									isNamespaceImport: true,
									moduleSpecifier: matchingImport.importDeclaration.moduleSpecifier.text,
									name: matchingImport.identifier.text
								});
								break;
							}
						}
					}
				}

				return factory.updateCallExpression(node, node.expression, node.typeArguments, [
					typescript.isTypeNode(implementationArg) ? factory.createIdentifier("undefined") : (continuation(implementationArg) as TS.Expression),
					factory.createObjectLiteralExpression([
						factory.createPropertyAssignment("identifier", factory.createNoSubstitutionTemplateLiteral(typeArgText)),
						...(!typescript.isTypeNode(implementationArg)
							? []
							: [factory.createPropertyAssignment("implementation", factory.createIdentifier(rewriteImplementationName(implementationArgText, options)))])
					])
				]);
			}
		}
	}

	return childContinuation(node);
}

interface FindMatchingImportDeclarationForIdentifierBaseResult {
	kind: "default" | "namespace" | "namedImport";
	importDeclaration: TS.ImportDeclaration;
}

interface FindMatchingImportDeclarationForIdentifierNamedImportResult extends FindMatchingImportDeclarationForIdentifierBaseResult {
	kind: "namedImport";
	importSpecifier: TS.ImportSpecifier;
}

interface FindMatchingImportDeclarationForIdentifierDefaultResult extends FindMatchingImportDeclarationForIdentifierBaseResult {
	kind: "default";
	identifier: TS.Identifier;
}

interface FindMatchingImportDeclarationForIdentifierNamespaceResult extends FindMatchingImportDeclarationForIdentifierBaseResult {
	kind: "namespace";
	identifier: TS.Identifier;
}

type FindMatchingImportDeclarationForIdentifierResult =
	| FindMatchingImportDeclarationForIdentifierNamedImportResult
	| FindMatchingImportDeclarationForIdentifierDefaultResult
	| FindMatchingImportDeclarationForIdentifierNamespaceResult;

function findMatchingImportDeclarationForIdentifier(
	identifier: string,
	options: BeforeVisitorOptions<TS.CallExpression>
): FindMatchingImportDeclarationForIdentifierResult | undefined {
	const {
		sourceFile,
		context: {typescript}
	} = options;

	// Find the matching import
	const importDeclarations = sourceFile.statements.filter(typescript.isImportDeclaration);

	for (const importDeclaration of importDeclarations) {
		if (importDeclaration.importClause == null) continue;

		// Default import
		if (importDeclaration.importClause.name?.text === identifier) {
			return {
				importDeclaration,
				kind: "default",
				identifier: importDeclaration.importClause.name
			};
		} else if (importDeclaration.importClause.namedBindings != null) {
			if (typescript.isNamespaceImport(importDeclaration.importClause.namedBindings)) {
				if (importDeclaration.importClause.namedBindings.name.text === identifier) {
					return {
						importDeclaration,
						kind: "namespace",
						identifier: importDeclaration.importClause.namedBindings.name
					};
				}
			} else {
				for (const importSpecifier of importDeclaration.importClause.namedBindings.elements) {
					if (importSpecifier.name.text === identifier) {
						return {
							importDeclaration,
							kind: "namedImport",
							importSpecifier: importSpecifier
						};
					}
				}
			}
		}
	}

	// No import was matched
	return undefined;
}

function rewriteImplementationName(name: string, options: BeforeVisitorOptions<TS.CallExpression>): string {
	const {
		context: {typescript, compilerOptions}
	} = options;

	switch (compilerOptions.module) {
		case typescript.ModuleKind.ES2020:
		case typescript.ModuleKind.ES2015:
		case typescript.ModuleKind.ESNext:
			return name;

		case typescript.ModuleKind.CommonJS:
		case typescript.ModuleKind.AMD:
		case typescript.ModuleKind.UMD: {
			// Find the matching import
			const match = findMatchingImportDeclarationForIdentifier(name, options);
			if (match == null) {
				return name;
			}

			switch (match.kind) {
				case "default":
					return `${name}.default`;
				case "namespace":
					return name;
				case "namedImport":
					return `${name}.${(match.importSpecifier.propertyName ?? match.importSpecifier.name).text}`;
			}

			// Fall back to returning the original name
			return name;
		}

		default:
			// TODO: Add support for SystemJS here
			return name;
	}
}

function getDiMethodKind(node: TS.Expression, context: VisitorContext): DiMethodKind | undefined {
	if (!context.typescript.isPropertyAccessExpression(node) && !context.typescript.isElementAccessExpression(node)) {
		return undefined;
	}

	if ("typeChecker" in context) {
		// Don't proceed unless the left-hand expression is the DIServiceContainer
		const type = context.typeChecker.getTypeAtLocation(node.expression);

		if (type == null || type.symbol == null || type.symbol.escapedName !== DI_CONTAINER_NAME) {
			return undefined;
		}
	} else {
		// Pick the left-hand side of the expression here
		const name = (node.expression.getFirstToken()?.getFullText() ?? node.expression.getFullText()).trim();

		// If not a single matcher matches the text, this does not represent an instance of DIContainer.
		if (!ensureArray(context.match).some(matcher => (typeof matcher === "string" ? name === matcher : matcher.test(name)))) {
			return undefined;
		}
	}

	let name: string;

	// If it is an element access expression, evaluate the argument expression
	if (context.typescript.isElementAccessExpression(node)) {
		const evaluationResult = context.evaluate(node.argumentExpression);

		// If no value could be computed, or if the value isn't of type string, do nothing
		if (!evaluationResult.success || typeof evaluationResult.value !== "string") {
			return undefined;
		} else {
			name = evaluationResult.value;
		}
	} else {
		name = node.name.text;
	}

	switch (name) {
		case "get":
		case "has":
		case "registerSingleton":
		case "registerTransient":
			return name;
		default:
			return undefined;
	}
}
