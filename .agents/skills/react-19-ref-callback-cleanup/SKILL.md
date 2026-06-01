---
name: react-19-ref-callback-cleanup
description: "Use for React 19 ref callback patterns, replacing useEffect-style element setup with callback refs that return cleanup, React Compiler-aware memoization guidance, and StrictMode-safe teardown checks."
argument-hint: "What element resource should be mounted and cleaned up via callback ref?"
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# React 19 Ref Callback Cleanup

Use this skill when a component sets up imperative behavior on a DOM element (canvas roots, observers, third-party widgets, event bridges) and you want setup/teardown colocated on the element ref instead of split across `useEffect`.

## When to Use

- A `ref` callback initializes something tied to a specific element.
- Existing code uses `useEffect` only to wait for `ref.current` before setup.
- You want React 19 cleanup semantics: callback ref returns a cleanup function.
- You need predictable behavior in `StrictMode` (development extra setup/cleanup cycle).

## Key React 19 Rules

1. Prefer callback refs that return cleanup:
   - `ref={(node) => { setup(node); return () => cleanup(node) }}`
2. When a cleanup function is returned, React uses that cleanup on detach/replacement.
3. Backward compatibility path: if no cleanup is returned, React may call callback with `null`.
4. React Compiler usually handles memoization automatically, so `useCallback` is optional by default.
5. Use manual `useCallback` as an escape hatch when you need explicit identity control.
6. In `StrictMode`, expect one extra setup+cleanup cycle in development.

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

## Branch: Legacy Compatibility Needed

If you intentionally support code that does not return cleanup yet:

```tsx
const mount = (node: HTMLDivElement | null) => {
	if (node == null) {
		// legacy detach path
		return;
	}
	setup(node);
};
```

Use this only as migration scaffolding. Prefer the cleanup-return pattern above.

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
