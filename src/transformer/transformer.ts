import {ArrayLiteralExpression, CallExpression, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, createArrayLiteral, createBlock, createComputedPropertyName, createGetAccessor, createIdentifier, createImportClause, createImportDeclaration, createImportSpecifier, createModifier, createNamedImports, createNamespaceImport, createObjectLiteral, createPropertyAssignment, createReturn, createStringLiteral, CustomTransformers, Expression, isCallExpression, isClassDeclaration, isClassExpression, isImportDeclaration, isNamedImports, isNamespaceImport, isPropertyAccessExpression, isTypeNode, Node, NodeArray, ParameterDeclaration, PropertyAccessExpression, SourceFile, SyntaxKind, TransformationContext, Transformer, TypeChecker, TypeNode, updateCall, updateClassDeclaration, updateClassExpression, updateSourceFileNode, visitEachChild, visitNode as _visitNode} from "typescript";
import {CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER, DI_CONTAINER_NAME} from "./constant";
import {DIMethodKind} from "./di-method-kind";
import {IResolveTypeNodeInImportsAndGenerateImportDeclarationResult} from "./i-resolve-type-node-in-imports-and-generate-import-declaration-result";
import {MultiMap} from "../lib/multi-map/multi-map";
import {MatchIdentifierInImports} from "./i-matched-identifier-in-imports";
import {IDIInputOptions} from "./i-di-input-options";

/**
 * Takes ConstructorParams for the given NodeArray of ParameterDeclarations
 * @param {NodeArray<ParameterDeclaration>} parameters
 * @returns {ArrayLiteralExpression}
 */
function takeConstructorParams (parameters: NodeArray<ParameterDeclaration>): ArrayLiteralExpression {
	const constructorParams: Expression[] = [];

	for (let i = 0; i < parameters.length; i++) {
		const parameter = parameters[i];
		// If the parameter has no type, there's nothing to extract
		if (parameter.type == null) {
			constructorParams[i] = createIdentifier("undefined");
		}

		else {
			constructorParams[i] = createStringLiteral(parameter.type.getFullText().trim());
		}
	}

	return createArrayLiteral(constructorParams);
}

/**
 * Returns true if the given TypeNode is already found within the given Import results
 * @param {TypeNode} typeNode
 * @param {MultiMap<string, IResolveTypeNodeInImportsAndGenerateImportDeclarationResult>} resolvedTypeNodeInImportsResults
 * @returns {boolean}
 */
function resolvedTypeNodeInImportsIsAlreadyMatched (typeNode: TypeNode, resolvedTypeNodeInImportsResults: MultiMap<string, IResolveTypeNodeInImportsAndGenerateImportDeclarationResult>): boolean {
	const sourceFile = typeNode.getSourceFile();
	if (sourceFile == null) return false;
	if (!resolvedTypeNodeInImportsResults.has(sourceFile.fileName)) return false;
	const typeNodeText = typeNode.getFullText().trim();
	return resolvedTypeNodeInImportsResults.findValue(sourceFile.fileName, result => result.identifierText === typeNodeText) != null;
}

/**
 * Resolves a TypeNode within the ImportDeclarations of the given SourceFile
 * @param {SourceFile} sourceFile
 * @param {TypeNode} typeNode
 * @param {MultiMap<string, IResolveTypeNodeInImportsAndGenerateImportDeclarationResult>} resolvedTypeNodeInImportsResults
 * @returns {IResolveTypeNodeInImportsAndGenerateImportDeclarationResult?}
 */
function resolveTypeNodeInImportsAndGenerateImportDeclaration (sourceFile: SourceFile, typeNode: TypeNode, resolvedTypeNodeInImportsResults: MultiMap<string, IResolveTypeNodeInImportsAndGenerateImportDeclarationResult>): IResolveTypeNodeInImportsAndGenerateImportDeclarationResult|undefined {
	if (resolvedTypeNodeInImportsIsAlreadyMatched(typeNode, resolvedTypeNodeInImportsResults)) return undefined;
	const typeNodeText = typeNode.getFullText().trim();

	const match = getIdentifierMatchInImports(sourceFile, typeNodeText);
	if (!match.matched) return undefined;

	switch (match.matchedIn) {
		case "name":
			return {
				identifierText: typeNodeText,
				importDeclaration: createImportDeclaration(
					undefined, undefined,
					createImportClause(createIdentifier(match.name), undefined),
					match.moduleSpecifier
				)
			};

		case "namespace":
			return {
				identifierText: typeNodeText,
				importDeclaration: createImportDeclaration(
					undefined, undefined,
					createImportClause(undefined, createNamespaceImport(createIdentifier(match.name))),
					match.moduleSpecifier
				)
			};

		case "named":
			return {
				identifierText: typeNodeText,
				importDeclaration: createImportDeclaration(
					undefined, undefined,
					createImportClause(undefined, createNamedImports([createImportSpecifier(match.propertyName == null ? undefined : createIdentifier(match.propertyName), createIdentifier(match.name))])),
					match.moduleSpecifier
				)
			};
	}

	return undefined;
}

/**
 * Resolves a TypeNode within the ImportDeclarations of the given SourceFile
 * @param {SourceFile} sourceFile
 * @param {string} identifier
 * @returns {MatchIdentifierInImports}
 */
function getIdentifierMatchInImports (sourceFile: SourceFile, identifier: string): MatchIdentifierInImports {

	for (const statement of sourceFile.statements) {
		if (!isImportDeclaration(statement) || statement.importClause == null) continue;

		if (statement.importClause.name != null && statement.importClause.name.text === identifier) {
			return {
				matched: true,
				matchedIn: "name",
				name: identifier,
				moduleSpecifier: statement.moduleSpecifier
			};
		}

		if (statement.importClause.namedBindings != null) {

			// Create a new ImportDeclaration of just the namespace import
			if (isNamespaceImport(statement.importClause.namedBindings) && statement.importClause.namedBindings.name.text === identifier) {
				return {
					matched: true,
					matchedIn: "namespace",
					name: identifier,
					moduleSpecifier: statement.moduleSpecifier
				};
			}

			if (isNamedImports(statement.importClause.namedBindings)) {
				for (const element of statement.importClause.namedBindings.elements) {
					// Create a new ImportDeclaration of just the named import
					if (element.name.text === identifier) {
						return {
							matched: true,
							matchedIn: "named",
							name: element.name.text,
							propertyName: element.propertyName == null ? undefined : element.propertyName.text,
							moduleSpecifier: statement.moduleSpecifier
						};
					}
				}
			}
		}

	}
	return {matched: false};
}

/**
 * Visits the given PropertyAccessExpression (which happens to be inside a CallExpression) and returns a DIMethodKind
 * if relevant
 * @param {Expression} node
 * @param {TypeChecker} typeChecker
 * @returns {DIMethodKind | undefined}
 */
function getDIMethodKindForPropertyAccessCallExpression (node: PropertyAccessExpression, typeChecker: TypeChecker): DIMethodKind|undefined {
	// Don't proceed unless the left-hand expression is the DIServiceContainer
	const type = typeChecker.getTypeAtLocation(node.expression);
	if (type == null || type.symbol == null || type.symbol.escapedName !== DI_CONTAINER_NAME) return undefined;
	switch (node.name.text) {
		case DIMethodKind.GET:
		case DIMethodKind.HAS:
		case DIMethodKind.REGISTER_SINGLETON:
		case DIMethodKind.REGISTER_TRANSIENT:
			return node.name.text;
		default:
			return undefined;
	}
}

/**
 * A transformer that can associate constructor arguments with any given class declaration
 * @type {(options: IDIInputOptions) => CustomTransformers}
 */
export const di = ({program}: IDIInputOptions): CustomTransformers => {
	const resolvedTypeNodeInImportsResults = new MultiMap<string, IResolveTypeNodeInImportsAndGenerateImportDeclarationResult>();

	return {
		after: [
			(_: TransformationContext): Transformer<SourceFile> => {
				return sourceFile => {
					if (!resolvedTypeNodeInImportsResults.has(sourceFile.fileName)) return sourceFile;

					return updateSourceFileNode(sourceFile, [
						...resolvedTypeNodeInImportsResults.get(sourceFile.fileName)
							.filter(v => getIdentifierMatchInImports(sourceFile, v.identifierText).matched === false)
							.map(v => v.importDeclaration),
						...sourceFile.statements
					]);
				};
			}
		],
		before: [
			(context: TransformationContext): Transformer<SourceFile> => {
				const typeChecker = program == null ? undefined : program.getTypeChecker();

				/**
				 * Visits the given CallExpression
				 * @param {CallExpression} node
				 * @param {TypeChecker} checker
				 * @returns {CallExpression | undefined}
				 */
				function visitCallExpression (node: CallExpression, checker: TypeChecker): CallExpression|undefined {
					if (isPropertyAccessExpression(node.expression)) {

						const diMethod = getDIMethodKindForPropertyAccessCallExpression(node.expression, checker);
						if (diMethod != null) {
							switch (diMethod) {

								case DIMethodKind.GET:
								case DIMethodKind.HAS: {
									// If no type arguments are given, don't modify the node at all
									if (node.typeArguments != null && node.typeArguments[0] != null) {
										return updateCall(
											node,
											node.expression,
											node.typeArguments,
											[
												createObjectLiteral(
													[
														createPropertyAssignment(
															"identifier",
															createStringLiteral(node.typeArguments[0].getFullText().trim())
														)
													]
												)
											]
										);
									}
									break;
								}

								case DIMethodKind.REGISTER_SINGLETON:
								case DIMethodKind.REGISTER_TRANSIENT:
									// If no type arguments are given, don't modify the node at all
									if (node.typeArguments != null) {
										let [typeArg, implementationArg]: NodeArray<TypeNode|Expression> = node.typeArguments;

										// If not implementation is provided, use the type argument *as* the implementation
										if (implementationArg == null) {
											implementationArg = typeArg;
										}

										// If another implementation is passed, used that one instead
										if (node.arguments.length > 0) {
											implementationArg = node.arguments[0];
										}

										const sourceFile = <SourceFile|undefined>implementationArg.getSourceFile();

										// If the Implementation is a TypeNode, it may be stripped from the file since Typescript won't Type-check the updates from
										// a CustomTransformer and such node would normally be removed from the imports
										if (isTypeNode(implementationArg) && sourceFile != null) {
											const resolvedTypeNodeInImports = resolveTypeNodeInImportsAndGenerateImportDeclaration(sourceFile, implementationArg, resolvedTypeNodeInImportsResults);
											if (resolvedTypeNodeInImports != null) {
												resolvedTypeNodeInImportsResults.add(sourceFile.fileName, resolvedTypeNodeInImports);
											}
										}

										// Only proceed if there is a type and an implementation (they may be the same)
										if (typeArg != null && implementationArg != null) {
											return updateCall(
												node,
												node.expression,
												node.typeArguments,
												[
													isTypeNode(implementationArg)
														? createIdentifier("undefined")
														: visitEachChild(implementationArg, visitNode, context),
													createObjectLiteral(
														[
															createPropertyAssignment(
																"identifier",
																createStringLiteral(typeArg.getFullText().trim())
															),
															...(!isTypeNode(implementationArg) ? [] : [
																createPropertyAssignment(
																	"implementation",
																	createIdentifier(implementationArg.getFullText().trim())
																)
															])
														]
													)
												]
											);
										}
									}
							}
						}
					}
					return visitEachChild(node, visitNode, context);
				}

				/**
				 * Visits the given Class
				 * @param {ClassDeclaration|ClassExpression} node
				 * @returns {ClassDeclaration|ClassExpression | undefined}
				 */
				function visitClass (node: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression|undefined {
					const constructorDeclaration = <ConstructorDeclaration|undefined>node.members.find(member => member.kind === SyntaxKind.Constructor);
					if (constructorDeclaration == null) return visitEachChild(node, visitNode, context);

					const updatedClassMembers: ReadonlyArray<ClassElement> = [
						...node.members.map(member => visitEachChild(member, visitNode, context)),
						createGetAccessor(
							undefined,
							[
								createModifier(SyntaxKind.PublicKeyword),
								createModifier(SyntaxKind.StaticKeyword)
							],
							createComputedPropertyName(
								createIdentifier(`Symbol.for("${CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER}")`)
							),
							[],
							undefined,
							createBlock([
									createReturn(
										takeConstructorParams(constructorDeclaration.parameters)
									)
								]
							)
						)
					];

					if (isClassDeclaration(node)) {
						return updateClassDeclaration(
							node,
							node.decorators,
							node.modifiers,
							node.name,
							node.typeParameters,
							node.heritageClauses,
							updatedClassMembers
						);
					}

					else {
						return updateClassExpression(
							node,
							node.modifiers,
							node.name,
							node.typeParameters,
							node.heritageClauses,
							updatedClassMembers
						);
					}
				}

				/**
				 * Visits the given Node
				 * @param {Node} node
				 * @returns {Node | undefined}
				 */
				function visitNode (node: Node): Node|undefined {
					if (typeChecker == null) return node;
					if (isClassDeclaration(node) || isClassExpression(node)) return visitClass(node);
					else if (isCallExpression(node)) return visitCallExpression(node, typeChecker);

					return visitEachChild(node, visitNode, context);
				}

				return (sourceFile) => {
					return _visitNode(sourceFile, visitNode);
				};
			}
		]
	};
};