---
name: react-component-sections
description: >-
  File and inline section ordering for React components. File-level: TYPE
  DEFINITIONS then COMPONENT START banner comments. Inside components: state,
  context, hooks, queries, form, effects, functions, render helpers, render
  inline comments. Use when creating or editing React components (.tsx),
  TypeScript modules with types, or when the user asks about component file
  structure or section comments.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.ts"
---

# React Component Sections

Component and module files follow a consistent two-section layout, separated by banner comments.

## Section order

1. **Imports** — at the top of the file, before any section header.
2. **TYPE DEFINITIONS** — all types, interfaces, and type aliases for the file.
3. **COMPONENT START** — the component implementation (or module exports / logic).

Never place types after the component. Never interleave types and implementation.

## Section headers

Use these exact banner comments. Cursor snippets: `comment_type_definitions`, `comment_component_start`.

```tsx
/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
```

```tsx
/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
```

## Component shape

In the TYPE DEFINITIONS section, name the component type the same as the component. Use `React.FC` with props inlined unless props are reused elsewhere.

In the COMPONENT START section, export with `export const Name: Name = (...) => { ... }`.

```tsx
import type React from "react";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
type MyWidget = React.FC<{
	label: string;
	count: number;
}>;

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
export const MyWidget: MyWidget = ({ label, count }) => {
	return (
		<div>
			{label}: {count}
		</div>
	);
};
```

Prop-less components skip the type alias — only `export const MyWidget = () => { ... }` in COMPONENT START. See [react-component-format](../react-component-format/SKILL.md) for route components and other exceptions.

## Inline sections (inside the component body)

Within COMPONENT START, order logic with `/***** X *****/` comments. Not every section is required — include a section only when it has content, but never reorder sections that are present.

| Order | Section          | Contents                                                      |
| ----- | ---------------- | ------------------------------------------------------------- |
| 1     | `state`          | `useState`, `useRef`, `useToggle`, and similar local state    |
| 2     | `context`        | Context reads (`use`, `useInvariantContext`, etc.)            |
| 3     | `hooks`          | Other custom or library hooks not covered above               |
| 4     | `queries`        | Data fetching (`useQuery`, `useSuspenseQuery`, etc.)          |
| 5     | `form`           | Form state and handlers (`useForm`, field registration, etc.) |
| 6     | `effects`        | Side effects (`useEffect`, subscriptions, etc.)               |
| 7     | `functions`      | Event handlers, callbacks, and other plain functions          |
| 8     | `render helpers` | Values or small helpers used only for JSX                     |
| 9     | `render`         | The `return (...)` JSX                                        |

If a section has code, its comment must be present. Skip sections with nothing in them — do not leave empty commented blocks.

Cursor snippets: `comment_state`, `comment_context`, `comment_hooks`, `comment_queries`, `comment_form`, `comment_effects`, `comment_functions`, `comment_render_helpers`, `comment_render`.

```tsx
export const MyWidget: MyWidget = ({ id }) => {
	/***** state *****/
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	/***** context *****/
	const { config } = use(GameConfigContext);

	/***** queries *****/
	const { data } = useQuery({ queryKey: ["widget", id], queryFn: () => fetchWidget(id) });

	/***** functions *****/
	const handleToggle = () => setOpen((prev) => !prev);

	/***** render helpers *****/
	const title = data?.name ?? "Loading…";

	/***** render *****/
	return (
		<div ref={ref}>
			<button type="button" onClick={handleToggle}>
				{title}
			</button>
		</div>
	);
};
```

## Non-component modules

The same section pattern applies to `.ts` files that export types and functions:

```ts
/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
export type StoreAction<TState> = { ... };

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
export const createStore = <TState>(...) => { ... };
```

Use COMPONENT START even when the section contains no React component — it marks where implementation begins.

## Route files

Route files may use alternate section names (e.g. `ROUTE START`) for route-specific blocks. Non-route React components always use TYPE DEFINITIONS → COMPONENT START.
