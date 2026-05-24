import { createChunkId, createDataId, type Chunk, type ChunkId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createStore } from "#/utilities/store";
import { createData } from "./actions/createData";
import { deleteData } from "./actions/deleteData";
import { getChunk } from "./actions/getChunk";
import { getData } from "./actions/getData";
import { updateData } from "./actions/updateData";

export const ChunkStore = createStore({
  state: new Map<ChunkId, Chunk>([
    [
      createChunkId("initial-chunk"), 
      { 
        id: createChunkId("initial-chunk"), 
        data: new Map([
          [
            createDataId("initial-data"), 
            { 
              id: createDataId("initial-data"), 
              chunkId: createChunkId("initial-chunk"), 
              attributes: {
                x: 0,
                y: 0,
              } 
            }
          ]
        ]) 
      }
    ]
  ]),
  actions: {
    getChunk,
    getData,
    updateData,
    createData,
    deleteData,
  }
});
