import type { ChunkId } from "#/routes/match/$matchId/-game/store/consts.ts";

export function createChunkId(s: string): ChunkId {
	return s as ChunkId;
}
