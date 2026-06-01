import type { ChunkId, DataId, TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { Chunks } from "#/routes/match/$matchId/-game/store/consts.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export type BoardOccupancy = {
	occupiedSquares: Set<string>;
	squareTeams: Map<string, TeamId>;
};

export function getBoardOccupancy(
	chunks: Chunks,
	exclude?: { dataId: DataId; chunkId: ChunkId },
): BoardOccupancy {
	const occupiedSquares = new Set<string>();
	const squareTeams = new Map<string, TeamId>();

	for (const chunk of chunks.values()) {
		for (const entry of chunk.data.values()) {
			if (exclude && exclude.dataId === entry.id && exclude.chunkId === chunk.id) {
				continue;
			}

			const key = gridCoordKey({
				x: entry.attributes.x,
				y: entry.attributes.y,
			});
			occupiedSquares.add(key);
			squareTeams.set(key, entry.attributes.teamId);
		}
	}

	return { occupiedSquares, squareTeams };
}
