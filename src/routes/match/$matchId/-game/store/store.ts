import { createInitialChunksFromSeed } from "#/routes/match/$matchId/-game/components/ChessBoard/createInitialChunksFromSeed.ts";
import { createStore } from "#/utilities/store";
import { createData } from "./actions/createData";
import { deleteData } from "./actions/deleteData";
import { getChunk } from "./actions/getChunk";
import { getData } from "./actions/getData";
import { updateData } from "./actions/updateData";

const initialState = createInitialChunksFromSeed();

export const ChunkStore = createStore({
	state: initialState,
	actions: {
		getChunk,
		getData,
		updateData,
		createData,
		deleteData,
	},
});
