---
name: react-avoid-use-effect
description: >-
  Avoid useEffect in this project. Prefer derived values, event handlers, ref
  callback cleanup, and other direct patterns. Ask the user before adding
  useEffect if no alternative exists. Use when creating or editing React
  components, hooks, or when useEffect is considered.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# Avoid useEffect

Do not use `useEffect` unless the user explicitly approves it first.

If you think `useEffect` is needed, stop and ask before implementing.

## Prefer instead

**Derive during render** when output follows from props, context, or state:

```tsx
const texture = new CanvasTexture(canvas);
```

The React Compiler memoizes when dependencies are unchanged.

**Event handlers** for user actions and DOM/Three.js interaction — not effects that mirror clicks.

**Ref callback cleanup** (React 19) for setup/teardown tied to a mounted node:

```tsx
<meshBasicMaterial
	ref={(material) => {
		if (!material) {
			return;
		}

		return () => {
			material.map?.dispose();
		};
	}}
/>
```

See [react-19-ref-callback-cleanup/SKILL.md](../react-19-ref-callback-cleanup/SKILL.md).

**Context reads** via `useInvariantContext` or `use` — not effects that sync context into local state.

## Do not use useEffect for

- Deriving display data from props or state
- Syncing context into local state
- One-time initialization that can happen during render or at module scope
- Cleanup that belongs on a ref callback

## When useEffect might be unavoidable

Rare cases (subscriptions to external stores, imperative browser APIs with no ref target, third-party widgets). Propose the effect to the user with the alternative you considered and wait for approval.
