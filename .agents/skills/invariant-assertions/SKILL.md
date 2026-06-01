---
name: invariant-assertions
description: >-
  Use invariant() from tiny-invariant for render-time must-be-true checks.
  Do not use if (x) throw new Error(...). Use when asserting conditions
  during render or when the user mentions invariant or assertion style.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.ts"
---

# Invariant assertions

When a condition must be true during render (or at a call site where failure is a programmer error, not expected runtime flow), use `invariant()` from `tiny-invariant` — not `if (!x) throw new Error(...)`.

`invariant` communicates intent: this should never fail in correct usage.

```tsx
import invariant from "tiny-invariant";

const context = canvas.getContext("2d");
invariant(context, "Failed to create 2d canvas context for piece label");
```

## Do not

```tsx
const context = canvas.getContext("2d");
if (!context) {
	throw new Error("Failed to create 2d canvas context for piece label");
}
```

## When not to use invariant

- Optional values handled with branching (`if (!material) return` in ref callbacks)
- Expected failure paths (user input, missing API data) — use normal control flow or typed errors
- `useInvariantContext` already wraps context reads with `invariant`

## Message

Pass a short string describing what was expected when the condition is falsy.
