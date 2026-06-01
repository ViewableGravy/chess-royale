import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
export type UseFrameAnimationOptions<T> = {
	/** Value used before the first integrated frame (lazy if a function). */
	initial: T | (() => T);
	getTarget: () => T;
	step: (current: T, target: T, deltaSeconds: number) => T;
	apply: (current: T) => void;
};

const isInitialFactory = <T>(value: T | (() => T)): value is () => T => typeof value === "function";

/**********************************************************************************************************
 *   HOOK
 **********************************************************************************************************/
/**
 * Chase-style frame animation: integrates `step` each R3F frame, then calls `apply`.
 * State lives in a ref so updates do not re-render React.
 */
export const useFrameAnimation = <T>({
	initial,
	getTarget,
	step,
	apply,
}: UseFrameAnimationOptions<T>) => {
	const stateRef = useRef<T | null>(null);

	useFrame((_, deltaSeconds) => {
		const target = getTarget();

		if (stateRef.current === null) {
			stateRef.current = isInitialFactory(initial) ? initial() : initial;
		}

		const current = stateRef.current;
		const next = step(current, target, deltaSeconds);
		stateRef.current = next;
		apply(next);
	});
};
