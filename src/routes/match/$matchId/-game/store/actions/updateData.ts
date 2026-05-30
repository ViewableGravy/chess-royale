import type { Data } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { ChunkStoreApi } from "#/routes/match/$matchId/-game/store/store.ts";

export function createUpdateData({ setState }: ChunkStoreApi) {
	return (data: Data) => {
		setState((prev) => {
			const chunks = new Map(prev);

			const chunk = chunks.get(data.chunkId);
			if (!chunk) {
				throw new Error(`Chunk with id ${data.chunkId} not found`);
			}
			const newChunkData = new Map(chunk.data);
			newChunkData.set(data.id, { ...data });

			const newChunk = { ...chunk, data: newChunkData };
			chunks.set(data.chunkId, newChunk);

			return chunks;
		});
	};
}
