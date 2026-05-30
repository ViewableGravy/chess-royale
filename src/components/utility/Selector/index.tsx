import type { Store } from "@tanstack/react-store";
import { useSelector } from "@tanstack/react-store";
import type React from "react";

/*** TYPE DEFINITIONS ***/
type Props<TState, TSelected = TState> = {
	store: Store<TState>;
	selector?: (state: TState) => TSelected;
	children: (selected: TSelected) => React.ReactNode;
};

/***** COMPONENT START *****/
export const Selector = <TState, TSelected = TState>({
	store,
	selector,
	children,
}: Props<TState, TSelected>) => {
	const selected = useSelector(
		store,
		selector ?? ((state: TState) => state as unknown as TSelected),
	);

	return <>{children(selected)}</>;
};
