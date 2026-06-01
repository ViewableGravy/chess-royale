import type { ChunkId, Data, DataId } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { Chunks } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { GridCoord } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export function findDataAtCoord(
	chunks: Chunks,
	coord: GridCoord,
	exclude?: { dataId: DataId; chunkId: ChunkId },
): Data | undefined {
	for (const chunk of chunks.values()) {
		for (const entry of chunk.data.values()) {
			if (exclude && exclude.dataId === entry.id && exclude.chunkId === chunk.id) {
				continue;
			}

			if (entry.attributes.x === coord.x && entry.attributes.y === coord.y) {
				return entry;
			}
		}
	}

	return undefined;
}
