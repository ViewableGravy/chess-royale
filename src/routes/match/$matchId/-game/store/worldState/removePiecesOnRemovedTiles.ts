import { batch } from "@tanstack/react-store";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export function removePiecesOnRemovedTiles(newlyRemoved: Iterable<string>) {
	const keys = [...newlyRemoved];
	if (keys.length === 0) {
		return;
	}

	const targets = new Set(keys);

	batch(() => {
		for (const chunk of ChunkStore.get().values()) {
			for (const entry of chunk.data.values()) {
				const key = gridCoordKey({
					x: entry.attributes.x,
					y: entry.attributes.y,
				});

				if (targets.has(key)) {
					ChunkStore.actions.deleteData(entry.id);
				}
			}
		}
	});
}
