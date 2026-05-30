import type {
	ChunkId,
	Chunks,
} from "#/routes/match/$matchId/-game/store/consts.ts";
import type { ChunkStoreApi } from "#/routes/match/$matchId/-game/store/store.ts";

export function createGetChunk({ get }: ChunkStoreApi) {
	return (chunkId: ChunkId, chunks?: Chunks) => {
		const chunk = (chunks ?? get()).get(chunkId);

		if (!chunk) {
			throw new Error(`Chunk with id ${chunkId} not found`);
		}

		return chunk;
	};
}
