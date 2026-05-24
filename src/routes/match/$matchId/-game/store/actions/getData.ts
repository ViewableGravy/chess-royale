import type { Chunk, Chunks, DataId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createGenericStoreAction } from "#/utilities/store";
import { Store } from "@tanstack/react-store";
export const getData = createGenericStoreAction((_: Store<Chunks>) => {
  return (dataId: DataId, chunk: Chunk) => {
    const item = chunk.data.get(dataId);
    if (!item) {
      throw new Error(`Data with id ${dataId} not found in chunk ${chunk.id}`);
    }

    return item;
  };
});
