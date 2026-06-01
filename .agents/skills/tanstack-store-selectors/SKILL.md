# TanStack Store `useSelector`

Use when subscribing to `@tanstack/react-store` from React components.

## Comparison behavior

`useSelector` compares the **selected value** with referential equality (`===`) by default. It does **not** shallow-compare object fields.

Pass `options.compare` only when you need custom equality (e.g. deep or shallow compare of a specific shape).

## Rules

- **Never** use `(state) => state` on a store whose `setState` spreads into a new root object — every mutation returns a new reference and forces a re-render.
- **Always** pass a selector that returns the smallest slice needed: primitives, stable references, or a derived boolean/number.
- Match patterns in `src/routes/match/$matchId/index.tsx` and `ChessBoard` (`state.closingZone`, `state.selectedPiece`, etc.).
- When render logic reads another store imperatively (e.g. `ChunkStore.state` inside a helper), also subscribe to that store with a targeted selector if highlights or UI must stay in sync on chunk-only updates.

## Examples

```tsx
const tick = useSelector(WorldStateStore, (state) => state.tick);
const canAct = useSelector(WorldStateStore, (state) => canLocalPlayerAct(state));
const removed = useSelector(
  WorldStateStore,
  (state) => state.closingZone.removed,
);
```

```tsx
// Bad — re-renders on every store mutation
const worldState = useSelector(WorldStateStore, (state) => state);
```
