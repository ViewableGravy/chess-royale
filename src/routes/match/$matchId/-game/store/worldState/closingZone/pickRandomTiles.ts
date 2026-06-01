export function pickRandomTiles(keys: string[], count: number): string[] {
	const pool = [...keys];

	for (let i = pool.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}

	return pool.slice(0, count);
}
