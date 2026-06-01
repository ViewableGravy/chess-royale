import { getNextTeamInTurnOrder } from "#/routes/match/$matchId/-game/store/turnOrder.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";

export function advanceActiveTeam(): void {
	WorldStateStore.setState((prev) => ({
		...prev,
		selectedPiece: null,
		activeTeamId: getNextTeamInTurnOrder(prev.activeTeamId),
	}));
}
