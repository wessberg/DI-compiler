import {IDIExpressionValidator} from "./i-di-expression-validator";
import {IDIExpressionValidatorValidateOptions} from "./i-di-expression-validator-validate-options";
import {IDIExpressionValidatorValidateResult} from "./i-di-expression-validator-validate-result";
import {DIExpression} from "../di-expression/i-di-expression";
import {DIExpressionDiagnostic, IDIExpressionDiagnostic, IDIExpressionTypeArgumentDiagnostic, IDIExpressionUserProvidedArgumentDiagnostic} from "../di-expression-diagnostic/i-di-expression-diagnostic";
import {DIExpressionKind} from "../di-expression/di-expression-kind";
import {DIExpressionDiagnosticKind} from "../di-expression-diagnostic/di-expression-diagnostic-kind";
import {IDIConfig} from "../di-config/i-di-config";
import {white, green, red, yellow, gray} from "chalk";

/**
 * A class that can validate DIExpressions
 */
export class DIExpressionValidator implements IDIExpressionValidator {
	constructor (private diConfig: IDIConfig) {
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
					if (expression.arguments.arguments.length > 0) {
						diagnostics.push(this.getUserProvidedArgumentDiagnostic(diExpression));
					}
					// One and only one type argument should be given
					if (expression.typeArguments.length !== 1) {
						diagnostics.push(this.getTypeArgumentDiagnostic(diExpression));
					}
					break;
				case DIExpressionKind.REGISTER_SINGLETON:
				case DIExpressionKind.REGISTER_TRANSIENT:
					// Maximum one argument may be given
					if (expression.arguments.arguments.length > 1) {
						diagnostics.push(this.getUserProvidedArgumentDiagnostic(diExpression));
					}
					// Two and only two type argument should be given
					if (expression.typeArguments.length !== 2) {
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
		if (diagnostics.length === 0) console.log(green(`DICompiler found no issues ✓`));
		else {
			let message = "";
			const separatorCount = 30;
			const separator = gray.bold(`\n${"_".repeat(separatorCount)}:`);
			message += yellow(`DIContainer found the following issues:`);
			diagnostics.forEach(diagnostic => {
				message += separator;
				message += red.bold(`\n${diagnostic.reason}`);
				message += red.bold(`\nfile: `);
				message += white(diagnostic.file);
				message += red.bold(`\nposition: `);
				message += white(`${diagnostic.position}`);
				message += red.bold(`\ncontent: `);
				message += white(diagnostic.content);
				message += separator;
			});
			throw new TypeError(message);
		}
	}

	/**
	 * Gets an IDIExpressionUserProvidedArgumentDiagnostic for the provided IDIExpression
	 * @param {IFormattedCallExpression} expression
	 * @returns {IDIExpressionUserProvidedArgumentDiagnostic}
	 */
	private getUserProvidedArgumentDiagnostic ({expression}: DIExpression): IDIExpressionUserProvidedArgumentDiagnostic {
		return {
			file: expression.file,
			content: expression.toString(),
			position: expression.arguments.startsAt,
			kind: DIExpressionDiagnosticKind.USER_PROVIDED_ARGUMENT,
			reason: `You shouldn't pass any arguments to ${this.diConfig.serviceContainerName} here`
		};
	}

	/**
	 * Gets an IDIExpressionTypeArgumentDiagnostic for the provided IDIExpression
	 * @param {IFormattedCallExpression} expression
	 * @param {DIExpressionKind} kind
	 * @returns {IDIExpressionTypeArgumentDiagnostic}
	 */
	private getTypeArgumentDiagnostic ({expression, kind}: DIExpression): IDIExpressionTypeArgumentDiagnostic {
		switch (kind) {

			case DIExpressionKind.GET:
			case DIExpressionKind.HAS:
				return {
					file: expression.file,
					position: expression.startsAt,
					kind: DIExpressionDiagnosticKind.TYPE_ARGUMENT,
					content: expression.toString(),
					reason: `You must pass only 1 type-argument to ${this.diConfig.serviceContainerName}`
				};

			case DIExpressionKind.REGISTER_TRANSIENT:
			case DIExpressionKind.REGISTER_SINGLETON:
				return {
					file: expression.file,
					position: expression.startsAt,
					kind: DIExpressionDiagnosticKind.TYPE_ARGUMENT,
					content: expression.toString(),
					reason: `You must pass 2 type-arguments to ${this.diConfig.serviceContainerName}. The first argument is the interface for the service and the second argument is the implementation`
				};
		}
	}
}