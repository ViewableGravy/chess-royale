import { use, type Context } from "react";
import invariant from "tiny-invariant";

/**
 * A custom hook that wraps the useContext hook and throws an error if the context value is null or undefined. This is useful for ensuring that a context value is always available when using the hook.
 *
 * @param context - The React context to use.
 * @returns The non-nullable value of the context.
 * @throws Will throw an error if the context value is null or undefined.
 */
export const useInvariantContext = <T>(context: Context<T>): NonNullable<T> => {
	const value = use(context);

	invariant(
		value !== null && value !== undefined,
		`Context ${context.displayName || context.name || "context"} value was null or undefined.`,
	);

	return value;
};
