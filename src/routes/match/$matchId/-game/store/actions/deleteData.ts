import type { Chunk, DataId } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { ChunkStoreApi } from "#/routes/match/$matchId/-game/store/store.ts";

export function createDeleteData({ setState }: ChunkStoreApi) {
	return (dataId: DataId) => {
		setState((prev) => {
			const chunks = new Map(prev);

			for (const [chunkId, chunk] of prev.entries()) {
				if (chunk.data.has(dataId)) {
					const newChunkData = new Map(chunk.data);
					newChunkData.delete(dataId);

					if (newChunkData.size === 0) {
						chunks.delete(chunkId);
					} else {
						const newChunk: Chunk = { ...chunk, data: newChunkData };
						chunks.set(chunkId, newChunk);
					}

					return chunks;
				}
			}

			return prev;
		});
	};
}
