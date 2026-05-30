export function createId<TId>(factory: (s: string) => TId): TId {
	const id = `${String(Date.now())}_${Math.random().toString(36).slice(2)}`;
	return factory(id);
}
