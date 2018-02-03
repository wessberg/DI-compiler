import {IDIExpressionValidator} from "./i-di-expression-validator";
import {IDIExpressionValidatorValidateOptions} from "./i-di-expression-validator-validate-options";
import {IDIExpressionValidatorValidateResult} from "./i-di-expression-validator-validate-result";
import {DIExpression, IDIRegisterExpression} from "../di-expression/i-di-expression";
import {DIExpressionDiagnostic, IDIExpressionDiagnostic, IDIExpressionProtectedConstructorDiagnostic, IDIExpressionTypeArgumentDiagnostic, IDIExpressionUserProvidedArgumentDiagnostic} from "../di-expression-diagnostic/i-di-expression-diagnostic";
import {DIExpressionKind} from "../di-expression/di-expression-kind";
import {DIExpressionDiagnosticKind} from "../di-expression-diagnostic/di-expression-diagnostic-kind";
import {IDIConfig} from "../di-config/i-di-config";
import chalk from "chalk";
import {IPrinter} from "@wessberg/codeanalyzer";

/**
 * A class that can validate DIExpressions
 */
export class DIExpressionValidator implements IDIExpressionValidator {
	constructor (private readonly diConfig: IDIConfig,
							 private readonly printer: IPrinter) {
	}

	/**
	 * Validates the provided IDIExpressions and returns diagnostics
	 * @param {IDIExpressionValidatorValidateOptions} options
	 * @returns {IDIExpressionValidatorValidateResult}
	 */
	public validate (options: IDIExpressionValidatorValidateOptions): IDIExpressionValidatorValidateResult {
		const expressions: DIExpression[] = Array.isArray(options.expressions) ? options.expressions : [options.expressions];
		const diagnostics: DIExpressionDiagnostic[] = [];

		// Loop through all expression and validate them
		expressions.forEach(diExpression => {
			const {kind, expression} = diExpression;
			switch (kind) {
				case DIExpressionKind.GET:
				case DIExpressionKind.HAS:

					// No arguments should be given
					if (expression.arguments.length > 0) {
						diagnostics.push(this.getUserProvidedArgumentDiagnostic(diExpression));
					}
					// One and only one type argument should be given
					if (expression.typeArguments == null || expression.typeArguments.length !== 1) {
						diagnostics.push(this.getTypeArgumentDiagnostic(diExpression));
					}
					break;
				case DIExpressionKind.REGISTER_SINGLETON:
				case DIExpressionKind.REGISTER_TRANSIENT:
					const registerExpression = <IDIRegisterExpression> diExpression;

					// If the constructor is protected, it cannot be invoked
					if (registerExpression.constructorIsProtected) {
						diagnostics.push(this.getProtectedConstructorDiagnostic(registerExpression));
					}

					// Maximum one argument may be given
					if (expression.arguments.length > 1) {
						diagnostics.push(this.getUserProvidedArgumentDiagnostic(diExpression));
					}
					// Two and only two type argument should be given
					if (expression.typeArguments == null || expression.typeArguments.length !== 2) {
						diagnostics.push(this.getTypeArgumentDiagnostic(diExpression));
					}

					break;
			}
		});
		return {diagnostics, print: () => this.printDiagnostics(diagnostics)};
	}

	/**
	 * Prints all diagnostics
	 * @param {IDIExpressionDiagnostic[]} diagnostics
	 */
	private printDiagnostics (diagnostics: IDIExpressionDiagnostic[]): void {
		if (diagnostics.length === 0) console.log(chalk.green(`DICompiler found no issues ✓`));
		else {
			let message = "";
			const separatorCount = 30;
			const separator = chalk.gray.bold(`\n${"_".repeat(separatorCount)}:`);
			message += chalk.yellow(`DIContainer found the following issues:`);
			diagnostics.forEach(diagnostic => {
				message += separator;
				message += chalk.red.bold(`\n${diagnostic.reason}`);
				message += chalk.red.bold(`\nfile: `);
				message += chalk.white(diagnostic.file);
				message += chalk.red.bold(`\nposition: `);
				message += chalk.white(`${diagnostic.position}`);
				message += chalk.red.bold(`\ncontent: `);
				message += chalk.white(diagnostic.content);
				message += separator;
			});
			throw new TypeError(message);
		}
	}

	/**
	 * Gets an IDIExpressionUserProvidedArgumentDiagnostic for the provided IDIExpression
	 * @param {PropertyAccessCallExpression} expression
	 * @param {string} file
	 * @returns {IDIExpressionUserProvidedArgumentDiagnostic}
	 */
	private getUserProvidedArgumentDiagnostic ({expression, file}: DIExpression): IDIExpressionUserProvidedArgumentDiagnostic {
		return {
			file,
			content: this.printer.print(expression),
			position: expression.arguments.pos,
			kind: DIExpressionDiagnosticKind.USER_PROVIDED_ARGUMENT,
			reason: `You shouldn't pass any arguments to ${this.diConfig.serviceContainerName} here`
		};
	}

	/**
	 * Gets an IDIExpressionProtectedConstructorDiagnostic for the provided IDIExpression
	 * @param {PropertyAccessCallExpression} expression
	 * @param {string} file
	 * @param {string} implementationName
	 * @param {string} typeName
	 * @returns {IDIExpressionProtectedConstructorDiagnostic}
	 */
	private getProtectedConstructorDiagnostic ({expression, file, implementationName, typeName}: IDIRegisterExpression): IDIExpressionProtectedConstructorDiagnostic {
		return {
			file,
			content: this.printer.print(expression),
			position: expression.arguments.pos,
			kind: DIExpressionDiagnosticKind.PROTECTED_CONSTRUCTOR,
			reason: `The implementation: "${implementationName}" for the interface: "${typeName}" is incompatible: The constructor is protected! Consider making the constructor public.`
		};
	}

	/**
	 * Gets an IDIExpressionTypeArgumentDiagnostic for the provided IDIExpression
	 * @param {PropertyAccessCallExpression} expression
	 * @param {DIExpressionKind.GET | DIExpressionKind.HAS | DIExpressionKind.REGISTER_SINGLETON | DIExpressionKind.REGISTER_TRANSIENT} kind
	 * @param {string} file
	 * @returns {IDIExpressionTypeArgumentDiagnostic}
	 */
	private getTypeArgumentDiagnostic ({expression, kind, file}: DIExpression): IDIExpressionTypeArgumentDiagnostic {
		switch (kind) {

			case DIExpressionKind.GET:
			case DIExpressionKind.HAS:
				return {
					file,
					position: expression.pos,
					kind: DIExpressionDiagnosticKind.TYPE_ARGUMENT,
					content: this.printer.print(expression),
					reason: `You must pass only 1 type-argument to ${this.diConfig.serviceContainerName}`
				};

			case DIExpressionKind.REGISTER_TRANSIENT:
			case DIExpressionKind.REGISTER_SINGLETON:
				return {
					file,
					position: expression.pos,
					kind: DIExpressionDiagnosticKind.TYPE_ARGUMENT,
					content: this.printer.print(expression),
					reason: `You must pass 2 type-arguments to ${this.diConfig.serviceContainerName}. The first argument is the interface for the service and the second argument is the implementation`
				};
		}
	}
}