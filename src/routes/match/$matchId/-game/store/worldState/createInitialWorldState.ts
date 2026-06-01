import { loadGameConfig } from "#/assets/config/loadGameConfig.ts";
import { FIRST_TURN_TEAM_ID } from "#/routes/match/$matchId/-game/store/turnOrder.ts";
import { createInitialClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/createInitialClosingZoneState.ts";
import type { WorldState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function createInitialWorldState(): WorldState {
	const { size: boardSize } = loadGameConfig().board;

	return {
		tick: 0,
		boardSize,
		closingZone: createInitialClosingZoneState(),
		selectedPiece: null,
		activeTeamId: FIRST_TURN_TEAM_ID,
		localPlayerTeamId: FIRST_TURN_TEAM_ID,
	};
}
