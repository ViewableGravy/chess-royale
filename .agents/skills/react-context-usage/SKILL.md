---
name: react-context-usage
description: >-
  React context consumption conventions for this project. Do not add thin
  useXContext wrappers; read contexts with useInvariantContext or use directly.
  Use when creating or editing React contexts, providers, or components that
  consume context.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# React Context Usage

Do not create abstractions whose only job is reading from context. Call `useInvariantContext` or `use` at the call site instead.

## Required context — use `useInvariantContext`

When a component is only rendered under a provider and the context must exist, read it directly:

```tsx
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";

export const ChessBoardFlatMeshes = () => {
	const { config, utils } = useInvariantContext(GameConfigContext);
	// ...
};
```

`useInvariantContext` throws at runtime if the value is `null` or `undefined`. Use this as the default when the provider is guaranteed by the component tree.

## Provide context inline

Do not add custom provider components unless they add real logic. Create the value at the call site and pass it to the context directly:

```tsx
function RouteComponent() {
	const config = loadGameConfig();
	const utils = createUtils(config);

	return (
		<GameConfigContext value={{ config, utils }}>
			<MatchPage />
		</GameConfigContext>
	);
}
```

Context modules should export the context object and value type only — not wrapper providers or factory helpers whose only job is assembling the value.

## Optional context — use `use`

When a context may legitimately be absent and the component handles that case:

```tsx
import { use } from "react";
import { OptionalContext } from "./OptionalContext.tsx";

export const MaybeWrapped = () => {
	const value = use(OptionalContext);
	if (value === null) {
		return null;
	}
	// ...
};
```

## Do not add thin `useXContext` hooks

Avoid wrappers that only delegate to `useInvariantContext` or `use`:

```tsx
// Do not
export function useGameConfig() {
	return useInvariantContext(GameConfigContext);
}
```

Custom hooks are appropriate when they combine context with other logic — additional hooks, derived state, side effects, or actions — not when they only re-export a context read.

## Context modules should export

- The context object (`GameConfigContext`)
- The value type (`GameContextValue`)
- Not thin consumer hooks or wrapper providers
