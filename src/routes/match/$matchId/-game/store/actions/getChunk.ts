import type { ChunkId, Chunks } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createGenericStoreAction } from "#/utilities/store";
import { Store } from "@tanstack/react-store";

export const getChunk = createGenericStoreAction((store: Store<Chunks>) => {
  return (chunkId: ChunkId, chunks: Chunks) => {
    const chunk = (chunks ?? store.state).get(chunkId);

    if (!chunk) {
      throw new Error(`Chunk with id ${chunkId} not found`);
    }

    return chunk;
  }
});
