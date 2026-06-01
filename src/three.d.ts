import type { OrbitControls } from "three-stdlib";

export { };

/** Match game canvas: drei `<OrbitControls makeDefault />` sets `RootState.controls`. */
export type GameRootState = Omit<
	import("@react-three/fiber").RootState,
	"controls"
> & {
	controls: OrbitControls | null;
};

declare module "@react-three/fiber" {
	/** Match game canvas: `controls` is drei `OrbitControls` when `makeDefault` is set. */
	export type RootState = GameRootState;

	/** `useThree` reads `RootState` from `store.js`; overload so selectors see `GameRootState`. */
	export function useThree<T>(
		selector: (state: GameRootState) => T,
		equalityFn?: <TSelected>(state: TSelected, newState: TSelected) => boolean,
	): T;
}

declare module "react" {
	namespace JSX {
		interface IntrinsicElements extends import("@react-three/fiber").ThreeElements {}
	}
}

declare module "three" {
	interface OrthographicCamera {
		/** R3F: skip automatic projection updates on resize */
		manual?: boolean;
	}

	interface PerspectiveCamera {
		manual?: boolean;
	}
}
