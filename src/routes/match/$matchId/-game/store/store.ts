import { createStore, type Store } from "@tanstack/react-store";
import { createInitialChunksFromSeed } from "#/routes/match/$matchId/-game/components/ChessBoard/createInitialChunksFromSeed.ts";
import type { Chunks } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createCreateData } from "./actions/createData";
import { createDeleteData } from "./actions/deleteData";
import { createGetChunk } from "./actions/getChunk";
import { getData } from "./actions/getData";
import { createUpdateData } from "./actions/updateData";

export type ChunkStoreApi = Pick<Store<Chunks>, "get" | "setState">;

const initialState = createInitialChunksFromSeed();

export const ChunkStore = createStore(initialState, (api) => ({
	getChunk: createGetChunk(api),
	getData,
	updateData: createUpdateData(api),
	createData: createCreateData(api),
	deleteData: createDeleteData(api),
}));
