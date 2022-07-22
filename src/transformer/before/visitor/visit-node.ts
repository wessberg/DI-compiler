import {BeforeVisitorOptions} from "../before-visitor-options.js";
import {TS} from "../../../type/type.js";
import {visitClassLikeDeclaration} from "./visit-class-like-declaration.js";
import {visitCallExpression} from "./visit-call-expression.js";

export function visitNode<T extends TS.Node>(options: BeforeVisitorOptions<T>): TS.VisitResult<TS.Node> {
	if (options.context.typescript.isClassLike(options.node)) {
		return visitClassLikeDeclaration({...options, node: options.node});
	} else if (options.context.typescript.isCallExpression(options.node)) {
		return visitCallExpression({...options, node: options.node});
	}

	return options.childContinuation(options.node);
}
