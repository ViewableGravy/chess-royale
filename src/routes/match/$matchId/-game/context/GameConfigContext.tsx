import { createContext } from "react";
import type { GameConfig } from "#/assets/config/loadGameConfig.ts";
import type { Utils } from "#/routes/match/$matchId/-game/utils/createUtils.ts";

export type GameContextValue = {
	config: GameConfig;
	utils: Utils;
};

export const GameConfigContext = createContext<GameContextValue | null>(null);
