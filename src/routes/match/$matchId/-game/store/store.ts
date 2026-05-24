import { type Chunk, type ChunkId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createStore } from "#/utilities/store";
import { createData } from "./actions/createData";
import { deleteData } from "./actions/deleteData";
import { getChunk } from "./actions/getChunk";
import { getData } from "./actions/getData";
import { updateData } from "./actions/updateData";

export const ChunkStore = createStore({
  state: new Map<ChunkId, Chunk>(),
  actions: {
    getChunk,
    getData,
    updateData,
    createData,
    deleteData,
  }
});
