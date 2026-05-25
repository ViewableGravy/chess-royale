import { createContext } from "react";
import type {
	ChunkId,
	DataId,
} from "#/routes/match/$matchId/-game/store/consts.ts";

/***** CONSTS *****/
export const ChunkIdContext = createContext<ChunkId | null>(null);
export const DataIdContext = createContext<DataId | null>(null);
