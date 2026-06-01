---
name: react-component-format
description: >-
  React component declaration format for this project. Use React.FC with a
  named type alias for components that accept props; use export const without
  a type for prop-less components. Route components registered on TanStack
  Route exports are an exception. Use when creating or editing React
  components (.tsx), or when the user asks about component structure.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# React Component Format

## One component per file

Each `.tsx` / `.jsx` file defines **at most one** React component. Extract additional components into their own files (folder + `index.tsx` matches the rest of the repo). Context objects, types, and pure helpers may share the file with that component, or live in a sibling `.ts` module when reused.

**Exception:** TanStack route modules may define the `Route` export and the route `component` / `shellComponent` function in the same file (see below).

## Component shapes

Every React component in this project follows one of two shapes — except route components (see below).

## Components with props

Define a `React.FC` type alias, then assign the implementation to a named `export const` with that type:

```tsx
import type React from "react";

type MyComponent = React.FC<{
	size: number;
	label: string;
}>;

export const MyComponent: MyComponent = ({ size, label }) => {
	return (
		<div>
			{label}: {size}
		</div>
	);
};
```

- Use `export const`, not `export function`.
- Name the type alias the same as the component.
- Put props inline in `React.FC<{ ... }>` unless they are reused elsewhere.

## Components without props

No type alias — only a named export:

```tsx
export const MyComponent = () => {
	return <div>Hello</div>;
};
```

## Route components (exception)

Components passed to `createFileRoute`, `createRootRouteWithContext`, or similar route config (`component`, `shellComponent`, etc.) use the `function` keyword and are defined **after** the `Route` export in the same file:

```tsx
export const Route = createFileRoute("/example")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Example</div>;
}
```

- Do not use `React.FC` or `export const` for route components.
- Props, if any, are typed inline on the function parameter.
- The route export always comes first.

## Route files

Route files (`src/routes/**`) contain only:

1. The `Route` export from `createFileRoute` (or equivalent)
2. The route component function defined **after** that export

Route components are composition-only — wire together providers, layout, and child components. Do not define additional components in the same file. Temporary or route-specific UI belongs inline in the route component, or in a separate file under the route folder (one component per file).

```tsx
export const Route = createFileRoute("/match/$matchId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const config = loadGameConfig();
	const utils = createUtils(config);

	return (
		<GameConfigContext value={{ config, utils }}>
			<GameFiberNode />
		</GameConfigContext>
	);
}
```

## Do not

- Use `export function ComponentName(...)` for non-route React components.
- Use default exports.
- Add `React.FC` for components that accept no props.
