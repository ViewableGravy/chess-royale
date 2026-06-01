import { FIRST_TURN_TEAM_ID } from "#/routes/match/$matchId/-game/store/turnOrder.ts";
import { advanceClosingZone } from "#/routes/match/$matchId/-game/store/worldState/closingZone/advanceClosingZone.ts";
import type { WorldState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

type WorldStateStoreApi = {
	setState: (updater: (prev: WorldState) => WorldState) => void;
};

export function createTick({ setState }: WorldStateStoreApi) {
	return () => {
		setState((prev) => ({
			...prev,
			tick: prev.tick + 1,
			closingZone: advanceClosingZone(prev.closingZone, prev.boardSize, prev.tick + 1),
			selectedPiece: null,
			activeTeamId: FIRST_TURN_TEAM_ID,
		}));
	};
}
