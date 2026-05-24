import type { Chunk, Chunks, DataId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createGenericStoreAction } from "#/utilities/store";
import { Store } from "@tanstack/react-store";
export const deleteData = createGenericStoreAction((store: Store<Chunks>) => {
  return (dataId: DataId) => {
    store.setState(prev => {
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
});
