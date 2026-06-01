import type { TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { WorldState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function canLocalPlayerAct(state: WorldState): boolean {
	return state.activeTeamId === state.localPlayerTeamId;
}

export function canInteractWithTeam(
	state: WorldState,
	teamId: TeamId,
): boolean {
	return (
		canLocalPlayerAct(state) && state.activeTeamId === teamId && teamId === state.localPlayerTeamId
	);
}
