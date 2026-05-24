<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `bunx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `bunx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Style Guidelines

- **No default exports:** Never use default exports in this repository. Always prefer named exports so imports remain explicit and easier to refactor.

- **No unnecessary type assertions or casts:** Do not add `as` type assertions or non-null assertions (`!`) when TypeScript can infer the type through control flow or generics. Prefer explicit runtime checks (e.g., `const val = map.get(key); if (!val) throw`) instead of `map.get(key)!`.
- **Never use `any`:** Avoid the `any` type entirely. If a value's type is unclear, prefer accurate union/unknown types and narrow them with type guards, or add precise type definitions rather than using `any`.

