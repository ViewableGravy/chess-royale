---
name: react-19-ref-callback-cleanup
description: "REQUIRED whenever you pass a function to ref or define a ref callback. React 19 callback refs with cleanup: non-null node parameter, return teardown. Never (node: T | null) with the cleanup-return pattern."
argument-hint: "What element resource should be mounted and cleaned up via callback ref?"
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# React 19 Ref Callback Cleanup

**Load and follow this skill every time** you add, edit, or review a callback passed to `ref` (including inline `ref={(node) => ...}` on DOM, R3F, or Drei elements).

Use it when a component sets up imperative behavior on an element (canvas roots, Three.js objects, observers, third-party widgets, event bridges) and you want setup/teardown colocated on the ref instead of split across `useEffect`.

## When to Use

- A `ref` callback initializes something tied to a specific element.
- Existing code uses `useEffect` only to wait for `ref.current` before setup.
- You want React 19 cleanup semantics: callback ref returns a cleanup function.
- You need predictable behavior in `StrictMode` (development extra setup/cleanup cycle).

## Key React 19 Rules

1. **Always** use callback refs that return cleanup:
   - `ref={(node) => { setup(node); return () => cleanup(); }}`
2. Setup callback parameter is **non-null** (`node: HTMLDivElement`, `node: Group`, etc.). React only calls setup with a real instance when you return cleanup.
3. When a cleanup function is returned, React runs that cleanup on detach/replacement — do **not** handle detach via `if (node == null)`.
4. In this repo, **never** type ref callbacks as `(node: T | null)` or branch on `node == null` for the main path.
5. React Compiler usually handles memoization automatically, so `useCallback` is optional by default.
6. Use manual `useCallback` as an escape hatch when you need explicit identity control.
7. In `StrictMode`, expect one extra setup+cleanup cycle in development.

## Decision Flow

1. Is setup bound to a concrete element instance?
   - Yes: use callback ref with cleanup.
   - No: keep lifecycle in `useEffect` or higher-level state logic.
2. Do you need teardown (dispose, unmount, disconnect, remove listeners)?
   - Yes: return cleanup from callback ref.
   - No: still consider returning explicit no-op cleanup if future teardown risk exists.
3. Is React Compiler enabled for this code path?

- Yes: write the callback ref directly; skip `useCallback` unless you need explicit control.
- No: use `useCallback` for stable callback identity when rerenders would otherwise recreate refs.

4. Do you need strict identity guarantees across non-compiler boundaries?

- Yes: use `useCallback` with correct dependencies.
- No: rely on compiler memoization.

## Procedure

1. Move element-bound setup code into a callback ref.
2. Change callback signature to non-null node for setup path.
3. Return teardown function from the callback.
4. Remove duplicated setup/teardown from `useEffect` that only existed for `ref.current` lifecycle.
5. If React Compiler is disabled or you need explicit identity control, wrap callback in `useCallback`.
6. Validate behavior in development and unmount/remount flows.

## Canonical Pattern

```tsx
function Component() {
	const mount = (node: HTMLCanvasElement) => {
		const resource = setup(node);

		return () => {
			resource.dispose?.();
			teardown(resource);
		};
	};

	return <canvas ref={mount} />;
}
```

## Branch: Manual Memoization Needed

Use this when React Compiler is not enabled, or when explicit callback identity is required:

```tsx
import { useCallback } from "react";

function Component() {
	const mount = useCallback((node: HTMLCanvasElement) => {
		const resource = setup(node);

		return () => {
			resource.dispose?.();
			teardown(resource);
		};
	}, []);

	return <canvas ref={mount} />;
}
```

## Not Allowed in This Repo

Do not use nullable ref callbacks or null branches for detach:

```tsx
// ❌ Do not write this
const mount = (node: HTMLDivElement | null) => {
	if (node == null) return;
	setup(node);
};
```

Use the cleanup-return pattern above instead. Legacy `null` detach calls exist only when **no** cleanup function is returned (old React behavior) — we do not use that path here.

## Quality Checklist

- Setup runs exactly where the element is attached.
- Teardown is returned from the same callback that performs setup.
- No leaked listeners, maps, roots, observers, or animation handles after unmount.
- Callback identity strategy matches runtime:
  - Compiler enabled: rely on compiler by default.
  - Compiler disabled or explicit control needed: use `useCallback` with correct dependencies.
- `StrictMode` extra development cycle leaves no residual state.
- No TypeScript widening to nullable setup argument in the main path.

## Common Mistakes

- Requiring `useCallback` unconditionally even when React Compiler is enabled.
- Assuming React Compiler removes all cases for manual memoization; it is still an escape hatch.
- Keeping teardown in `useEffect` while setup moved to callback ref (split lifecycle).
- Ignoring `StrictMode` extra development cycle and assuming double setup is a bug.
- Forgetting to dispose external resources (render roots, observers, subscriptions).

## Done Criteria

- Element setup/cleanup are fully colocated in callback ref.
- Component behavior matches previous functionality across mount, update, unmount.
- No cleanup leaks under repeated mount/unmount testing.
