import type { Store } from "@tanstack/react-store";
import { useSelector } from "@tanstack/react-store";
import type React from "react";

/*** TYPE DEFINITIONS ***/
type Props<TState, TSelected = TState> = {
  store: Store<TState>;
  selector?: (state: TState) => TSelected;
  children: (selected: TSelected) => React.ReactNode;
}

type Selector = <TState, TSelected = TState>(props: Props<TState, TSelected>) => React.ReactNode;

/***** COMPONENT START *****/
export const Selector: Selector = ({ store, selector, children }) => {
  // biome-ignore lint/suspicious/noExplicitAny: cannot infer correctly with generic
  const selected = useSelector(store, selector ?? ((state): any => state));

  return <>{children(selected)}</>;
}