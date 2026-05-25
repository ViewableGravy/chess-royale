import type { Store } from "@tanstack/react-store";
import type {
	Chunks,
	Data,
} from "#/routes/match/$matchId/-game/store/consts.ts";
import { createGenericStoreAction } from "#/utilities/store";
export const updateData = createGenericStoreAction((store: Store<Chunks>) => {
	return (data: Data) => {
		store.setState((prev) => {
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
});
