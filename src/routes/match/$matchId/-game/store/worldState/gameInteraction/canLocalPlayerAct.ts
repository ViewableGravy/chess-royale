import type { TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import type { WorldState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function canLocalPlayerAct(
	state: Pick<WorldState, "activeTeamId" | "localPlayerTeamId">,
): boolean {
	return state.activeTeamId === state.localPlayerTeamId;
}

export function canInteractWithTeam(
	state: Pick<WorldState, "activeTeamId" | "localPlayerTeamId">,
	teamId: TeamId,
): boolean {
	return (
		canLocalPlayerAct(state) && state.activeTeamId === teamId && teamId === state.localPlayerTeamId
	);
}
