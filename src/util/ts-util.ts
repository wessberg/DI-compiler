import { TS } from "../type/type";
import { ImportedSymbol } from "../type/imported-symbol";
import { VisitorContext } from "../transformer/visitor-context";
import { RootBlock } from "../type/root-block";

type TSWithHelpers = typeof TS & {
  importDefaultHelper?: TS.EmitHelper;
  importStarHelper?: TS.EmitHelper;
};

// For some TypeScript versions, such as 3.1, these helpers are not exposed by TypeScript,
// so they will have to be duplicated and reused from here in these rare cases
const HELPERS = {
  importDefaultHelper: {
    name: "typescript:commonjsimportdefault",
    scoped: false,
    text: '\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { "default": mod };\n};',
  },
  importStarHelper: {
    name: "typescript:commonjsimportstar",
    scoped: false,
    text: '\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result["default"] = mod;\n    return result;\n};',
  },
} as const;

export function getImportDefaultHelper(
  typescript: TSWithHelpers
): TS.EmitHelper {
  return typescript.importDefaultHelper ?? HELPERS.importDefaultHelper;
}

export function getImportStarHelper(typescript: TSWithHelpers): TS.EmitHelper {
  return typescript.importStarHelper ?? HELPERS.importStarHelper;
}

export function moduleKindSupportsImportHelpers(
  moduleKind: TS.ModuleKind = TS.ModuleKind.CommonJS,
  typescript: typeof TS
): boolean {
  switch (moduleKind) {
    case typescript.ModuleKind.CommonJS:
    case typescript.ModuleKind.UMD:
    case typescript.ModuleKind.AMD:
      return true;
    default:
      return false;
  }
}

export function moduleKindDefinesDependencies(
  moduleKind: TS.ModuleKind = TS.ModuleKind.CommonJS,
  typescript: typeof TS
): boolean {
  switch (moduleKind) {
    case typescript.ModuleKind.UMD:
    case typescript.ModuleKind.AMD:
      return true;
    default:
      return false;
  }
}

interface EmitHelperFactory {
  getUnscopedHelperName(helperName: string): TS.Identifier;
}

type TSWithEmitHelpers = typeof TS &
  (
    | EmitHelperFactory
    | {
        createEmitHelperFactory(
          factory: TS.TransformationContext
        ): EmitHelperFactory;
      }
    | {
        getHelperName(helperName: string): TS.Identifier;
      }
  );

export function getUnscopedHelperName(
  context: VisitorContext,
  helperName: string
): TS.Identifier {
  const typescript = context.typescript as TSWithEmitHelpers;
  if ("getUnscopedHelperName" in typescript) {
    return typescript.getUnscopedHelperName(helperName);
  } else if ("createEmitHelperFactory" in typescript) {
    return typescript
      .createEmitHelperFactory(context.transformationContext)
      .getUnscopedHelperName(helperName);
  } else {
    return typescript.getHelperName(helperName);
  }
}

export function getRootBlockInsertionPosition(
  rootBlock: RootBlock,
  typescript: typeof TS
): number {
  let insertPosition = 0;

  for (let i = 0; i < rootBlock.statements.length; i++) {
    const statement = rootBlock.statements[i];

    const isUseStrict =
      typescript.isExpressionStatement(statement) &&
      typescript.isStringLiteralLike(statement.expression) &&
      statement.expression.text === "use strict";

    const isEsModuleSymbol =
      typescript.isExpressionStatement(statement) &&
      typescript.isCallExpression(statement.expression) &&
      typescript.isPropertyAccessExpression(statement.expression.expression) &&
      typescript.isIdentifier(statement.expression.expression.expression) &&
      typescript.isIdentifier(statement.expression.expression.name) &&
      statement.expression.expression.expression.text === "Object" &&
      statement.expression.expression.name.text === "defineProperty" &&
      statement.expression.arguments.length >= 2 &&
      typescript.isIdentifier(statement.expression.arguments[0]) &&
      statement.expression.arguments[0].text === "exports" &&
      typescript.isStringLiteralLike(statement.expression.arguments[1]) &&
      statement.expression.arguments[1].text === "__esModule";

    if (isUseStrict || isEsModuleSymbol) {
      insertPosition = Math.max(insertPosition, i + 1);
    }
  }
  return insertPosition;
}

export function getDefineArrayLiteralExpression(
  sourceFile: TS.SourceFile,
  context: VisitorContext
): TS.ArrayLiteralExpression | undefined {
  const { program, typescript } = context;
  const compilerOptions = program.getCompilerOptions();

  switch (compilerOptions.module) {
    case typescript.ModuleKind.ESNext:
    case typescript.ModuleKind.ES2015:
    case typescript.ModuleKind.ES2020:
      // There are no such thing for these module types
      return undefined;

    // If we're targeting UMD, the root block won't be the root scope, but the Function Body of an iife
    case typescript.ModuleKind.UMD: {
      for (const statement of sourceFile.statements) {
        if (
          typescript.isExpressionStatement(statement) &&
          typescript.isCallExpression(statement.expression) &&
          typescript.isParenthesizedExpression(
            statement.expression.expression
          ) &&
          typescript.isFunctionExpression(
            statement.expression.expression.expression
          ) &&
          statement.expression.expression.expression.parameters.length === 1
        ) {
          const [firstParameter] =
            statement.expression.expression.expression.parameters;
          if (typescript.isIdentifier(firstParameter.name)) {
            if (firstParameter.name.text === "factory") {
              for (const subStatement of statement.expression.expression
                .expression.body.statements) {
                if (
                  typescript.isIfStatement(subStatement) &&
                  subStatement.elseStatement != null &&
                  typescript.isIfStatement(subStatement.elseStatement) &&
                  typescript.isBlock(subStatement.elseStatement.thenStatement)
                ) {
                  for (const subSubStatement of subStatement.elseStatement
                    .thenStatement.statements) {
                    if (
                      typescript.isExpressionStatement(subSubStatement) &&
                      typescript.isCallExpression(subSubStatement.expression) &&
                      subSubStatement.expression.arguments.length === 2 &&
                      typescript.isIdentifier(
                        subSubStatement.expression.expression
                      ) &&
                      subSubStatement.expression.expression.text === "define"
                    ) {
                      const [firstSubSubStatementExpressionArgument] =
                        subSubStatement.expression.arguments;
                      if (
                        typescript.isArrayLiteralExpression(
                          firstSubSubStatementExpressionArgument
                        )
                      ) {
                        return firstSubSubStatementExpressionArgument;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      break;
    }

    case typescript.ModuleKind.AMD: {
      for (const statement of sourceFile.statements) {
        if (
          typescript.isExpressionStatement(statement) &&
          typescript.isCallExpression(statement.expression) &&
          typescript.isIdentifier(statement.expression.expression) &&
          statement.expression.expression.text === "define" &&
          statement.expression.arguments.length === 2
        ) {
          const [firstArgument, secondArgument] =
            statement.expression.arguments;
          if (typescript.isArrayLiteralExpression(firstArgument)) {
            if (
              typescript.isFunctionExpression(secondArgument) &&
              secondArgument.parameters.length >= 2
            ) {
              const [firstParameter, secondParameter] =
                secondArgument.parameters;
              if (
                typescript.isIdentifier(firstParameter.name) &&
                typescript.isIdentifier(secondParameter.name) &&
                firstParameter.name.text === "require" &&
                secondParameter.name.text === "exports"
              ) {
                return firstArgument;
              }
            }
          }
        }
      }
      break;
    }
  }

  return undefined;
}

export function getRootBlock(
  sourceFile: TS.SourceFile,
  context: VisitorContext
): RootBlock {
  const { program, typescript } = context;
  const compilerOptions = program.getCompilerOptions();

  switch (compilerOptions.module) {
    // If we're targeting UMD, the root block won't be the root scope, but the Function Body of an iife
    case typescript.ModuleKind.UMD: {
      for (const statement of sourceFile.statements) {
        if (
          typescript.isExpressionStatement(statement) &&
          typescript.isCallExpression(statement.expression) &&
          statement.expression.arguments.length === 1
        ) {
          const [firstArgument] = statement.expression.arguments;
          if (
            typescript.isFunctionExpression(firstArgument) &&
            firstArgument.parameters.length === 2
          ) {
            const [firstParameter, secondParameter] = firstArgument.parameters;
            if (
              typescript.isIdentifier(firstParameter.name) &&
              typescript.isIdentifier(secondParameter.name) &&
              firstParameter.name.text === "require" &&
              secondParameter.name.text === "exports"
            ) {
              return firstArgument.body;
            }
          }
        }
      }
      break;
    }

    // If we're targeting AMD, the root block won't be the root scope, but the Function Body of the
    // anonymous function provided as a second argument to the define() function
    case typescript.ModuleKind.AMD: {
      for (const statement of sourceFile.statements) {
        if (
          typescript.isExpressionStatement(statement) &&
          typescript.isCallExpression(statement.expression) &&
          typescript.isIdentifier(statement.expression.expression) &&
          statement.expression.expression.text === "define" &&
          statement.expression.arguments.length === 2
        ) {
          const [, secondArgument] = statement.expression.arguments;
          if (
            typescript.isFunctionExpression(secondArgument) &&
            secondArgument.parameters.length >= 2
          ) {
            const [firstParameter, secondParameter] = secondArgument.parameters;
            if (
              typescript.isIdentifier(firstParameter.name) &&
              typescript.isIdentifier(secondParameter.name) &&
              firstParameter.name.text === "require" &&
              secondParameter.name.text === "exports"
            ) {
              return secondArgument.body;
            }
          }
        }
      }
      break;
    }
  }

  return sourceFile;
}

export function isImportedSymbolImported(
  importedSymbol: ImportedSymbol,
  rootBlock: RootBlock,
  context: VisitorContext
): boolean {
  const compilerOptions = context.program.getCompilerOptions();
  const typescript = context.typescript;

  switch (compilerOptions.module) {
    case typescript.ModuleKind.ES2020:
    case typescript.ModuleKind.ES2015:
    case typescript.ModuleKind.ESNext: {
      for (const statement of rootBlock.statements) {
        if (!typescript.isImportDeclaration(statement)) continue;
        if (!typescript.isStringLiteralLike(statement.moduleSpecifier)) {
          continue;
        }
        if (statement.moduleSpecifier.text !== importedSymbol.moduleSpecifier) {
          continue;
        }
        if (statement.importClause == null) {
          continue;
        }

        if ("isDefaultImport" in importedSymbol) {
          if (importedSymbol.isDefaultImport) {
            if (statement.importClause.name == null) {
              continue;
            }
            if (statement.importClause.name.text !== importedSymbol.name) {
              continue;
            }
            return true;
          } else {
            if (statement.importClause.namedBindings == null) continue;
            if (
              !typescript.isNamedImports(statement.importClause.namedBindings)
            ) {
              continue;
            }
            for (const importSpecifier of statement.importClause.namedBindings
              .elements) {
              if (importSpecifier.name.text !== importedSymbol.name) continue;
              return true;
            }
          }
        } else if ("isNamespaceImport" in importedSymbol) {
          if (statement.importClause.namedBindings == null) continue;
          if (
            !typescript.isNamespaceImport(statement.importClause.namedBindings)
          ) {
            continue;
          }
          if (
            statement.importClause.namedBindings.name.text !==
            importedSymbol.name
          ) {
            continue;
          }
          return true;
        }
      }

      return false;
    }

    case typescript.ModuleKind.CommonJS:
    case typescript.ModuleKind.AMD:
    case typescript.ModuleKind.UMD: {
      for (const statement of rootBlock.statements) {
        if (!typescript.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (!typescript.isIdentifier(declaration.name)) continue;
          if (declaration.name.text !== importedSymbol.name) continue;
          return true;
        }
      }
    }
  }

  // TODO: Add support for other module systems
  return false;
}

export function generateImportStatementForImportedSymbolInContext(
  importedSymbol: ImportedSymbol,
  context: VisitorContext
): TS.Statement | undefined {
  const compilerOptions = context.program.getCompilerOptions();
  const { factory, typescript } = context;

  switch (compilerOptions.module) {
    case typescript.ModuleKind.ES2020:
    case typescript.ModuleKind.ES2015:
    case typescript.ModuleKind.ESNext: {
      return factory.createImportDeclaration(
        undefined,
        undefined,
        "isDefaultImport" in importedSymbol
          ? factory.createImportClause(
              false,
              !importedSymbol.isDefaultImport
                ? undefined
                : factory.createIdentifier(importedSymbol.name),
              importedSymbol.isDefaultImport
                ? undefined
                : factory.createNamedImports([
                    factory.createImportSpecifier(
                      false,
                      importedSymbol.propertyName === importedSymbol.name
                        ? undefined
                        : factory.createIdentifier(importedSymbol.propertyName),
                      factory.createIdentifier(importedSymbol.name)
                    ),
                  ])
            )
          : "isNamespaceImport" in importedSymbol
          ? factory.createImportClause(
              false,
              undefined,
              factory.createNamespaceImport(
                factory.createIdentifier(importedSymbol.name)
              )
            )
          : undefined,
        factory.createStringLiteral(importedSymbol.moduleSpecifier)
      );
    }

    case typescript.ModuleKind.CommonJS:
    case typescript.ModuleKind.AMD:
    case typescript.ModuleKind.UMD: {
      const requireCall = factory.createCallExpression(
        factory.createIdentifier("require"),
        undefined,
        [factory.createStringLiteral(importedSymbol.moduleSpecifier)]
      );

      let wrappedRequireCall = requireCall;

      // We'll need to use a helper, '__importDefault', and wrap the require call with it
      if (
        compilerOptions.esModuleInterop === true &&
        (("isDefaultImport" in importedSymbol &&
          importedSymbol.isDefaultImport) ||
          (!("isDefaultImport" in importedSymbol) &&
            importedSymbol.isNamespaceImport))
      ) {
        // If tslib is being used, we can do something like 'require("tslib").__import{Default|Star}(<requireCall>)'
        if (compilerOptions.importHelpers === true) {
          wrappedRequireCall = factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createCallExpression(
                factory.createIdentifier("require"),
                undefined,
                [factory.createStringLiteral("tslib")]
              ),
              getUnscopedHelperName(
                context,
                "isDefaultImport" in importedSymbol
                  ? "__importDefault"
                  : "__importStar"
              )
            ),
            undefined,
            [requireCall]
          );
        }

        // Otherwise, we'll have to make sure that the helper is being inlined in an transformation step later
        else {
          // We've already requested the __importDefault helper in the before transformer under these
          // circumstances
          wrappedRequireCall = factory.createCallExpression(
            getUnscopedHelperName(
              context,
              "isDefaultImport" in importedSymbol
                ? "__importDefault"
                : "__importStar"
            ),
            undefined,
            [requireCall]
          );
        }
      }

      return factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(importedSymbol.name),
              undefined,
              undefined,
              wrappedRequireCall
            ),
          ],
          typescript.NodeFlags.Const
        )
      );
    }
  }

  // TODO: Handle other module types as well
  return undefined;
}
