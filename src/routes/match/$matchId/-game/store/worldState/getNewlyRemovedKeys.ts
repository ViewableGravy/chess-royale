export function getNewlyRemovedKeys(
	current: ReadonlySet<string>,
	processed: ReadonlySet<string>,
): string[] {
	const newlyRemoved: string[] = [];

	for (const key of current) {
		if (!processed.has(key)) {
			newlyRemoved.push(key);
		}
	}

	return newlyRemoved;
}
