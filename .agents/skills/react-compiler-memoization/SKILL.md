---
name: react-compiler-memoization
description: >-
  React Compiler memoization conventions for this project. Do not add useMemo,
  useCallback, or memo in React components unless an escape hatch applies. Use
  when creating or editing React components (.tsx), hooks, or when the user
  mentions memoization, useMemo, useCallback, React.memo, or the React Compiler.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# React Compiler — No Manual Memoization

This project compiles React with the React Compiler (`babel-plugin-react-compiler` via `@vitejs/plugin-react` + `@rolldown/plugin-babel` in `vite.config.ts`). The compiler automatically memoizes components, hooks, and values where needed.

## Default rule

**Do not use `useMemo`, `useCallback`, or `React.memo`.** Write plain expressions, inline handlers, and unwrapped components. Let the compiler handle memoization.

```tsx
// Preferred
function Board({ size }: { size: number }) {
  const squares = buildSquares(size);

  return (
    <ul>
      {squares.map((square) => (
        <li key={square.id} onClick={() => select(square.id)}>
          {square.label}
        </li>
      ))}
    </ul>
  );
}
```

```tsx
// Avoid unless an escape hatch applies
const squares = useMemo(() => buildSquares(size), [size]);
const onSelect = useCallback((id: string) => select(id), []);
export const Board = memo(BoardInner);
```

## When removing existing memoization

If you touch a component that already uses `useMemo`, `useCallback`, or `memo`, remove it when the only reason was performance. Keep the logic; drop the wrapper.

## Escape hatches (rare)

Manual memoization is allowed only when the compiler cannot safely optimize, or an external API requires stable identity:

1. **`"use no memo"`** or **`"use memo"`** compiler directives on a function the compiler skips or must not optimize.
2. **Third-party libraries** that compare props or callback identity by reference and break without stable references.
3. **Explicit team decision** documented in a code comment explaining why the compiler is insufficient.

If none of these apply, do not add manual memoization.

## Related skills

- For React 19 callback ref setup/teardown, see [react-19-ref-callback-cleanup](../react-19-ref-callback-cleanup/SKILL.md).
- For component declaration format, see [react-component-format](../react-component-format/SKILL.md).
