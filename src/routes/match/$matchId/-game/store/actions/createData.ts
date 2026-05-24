import type { Chunk, ChunkId, Chunks, Data } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createChunkId, createDataId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createGenericStoreAction } from "#/utilities/store";
import { createId } from "#/utils/functions/createId";
import { Store } from "@tanstack/react-store";

export type CreateDataInput = Omit<Data, 'id' | 'chunkId'> | Omit<Data, 'id'>;

export const createData = createGenericStoreAction((store: Store<Chunks>) => {
  return (data: CreateDataInput, chunkIdHint?: ChunkId) => {
    const MAX_AUTOMATIC_CHUNK_SIZE = 10;
    const MAX_ABSOLUTE_CHUNK_SIZE = 20;

    let preferredChunk: ChunkId | undefined = chunkIdHint;
    if (data && 'chunkId' in data) {
      preferredChunk = data.chunkId;
    }

    if (preferredChunk) {
      const chunks = store.state;
      const target = chunks.get(preferredChunk);

      if (target && target.data.size < MAX_ABSOLUTE_CHUNK_SIZE) {
        const dataId = createId(createDataId);
        const newData: Data = { id: dataId, chunkId: preferredChunk, attributes: data.attributes };

        store.setState((prev) => {
          const chunks = new Map(prev);

          if (!chunks.has(preferredChunk)) {
            const chunk: Chunk = { id: preferredChunk, data: new Map([[dataId, newData]]) };
            chunks.set(preferredChunk, chunk);
          } else {
            const chunk = chunks.get(preferredChunk)!;
            const newChunkData = new Map(chunk.data);
            newChunkData.set(dataId, newData);
            const newChunk: Chunk = { ...chunk, data: newChunkData };
            chunks.set(preferredChunk, newChunk);
          }

          return chunks;
        });

        return [preferredChunk, dataId] as const;
      }
    }

    let targetChunkId: ChunkId | undefined;
    for (const [id, chunk] of store.state.entries()) {
      if (chunk.data.size < MAX_AUTOMATIC_CHUNK_SIZE) {
        targetChunkId = id;
        break;
      }
    }

    const finalTargetChunkId = targetChunkId ?? createId(createChunkId);

    const dataId = createId(createDataId);
    const newData: Data = { id: dataId, chunkId: finalTargetChunkId, attributes: data.attributes };

    store.setState((prev) => {
      const chunks = new Map(prev);
      
      if (!chunks.has(finalTargetChunkId)) {
        const chunk: Chunk = { id: finalTargetChunkId, data: new Map([[dataId, newData]]) };
        chunks.set(finalTargetChunkId, chunk);
      } else {
        const chunk = chunks.get(finalTargetChunkId)!;
        const newChunkData = new Map(chunk.data);
        newChunkData.set(dataId, newData);
        const newChunk: Chunk = { ...chunk, data: newChunkData };
        chunks.set(finalTargetChunkId, newChunk);
      }

      return chunks;
    });

    return [targetChunkId, dataId] as const;
  }
});
