import type { TeamId, TeamName } from "#/routes/match/$matchId/-game/store/consts.ts";
import { createTeamId } from "#/routes/match/$matchId/-game/store/createTeamId.ts";

/** Round-robin turn order; south is the light ("white") side. */
export const TURN_ORDER = ["south", "north", "west", "east"] as const satisfies readonly TeamName[];

export const FIRST_TURN_TEAM_ID = createTeamId(TURN_ORDER[0]);

export function getNextTeamInTurnOrder(teamId: TeamId): TeamId {
	const index = TURN_ORDER.indexOf(teamId as TeamName);
	const nextIndex = index === -1 ? 0 : (index + 1) % TURN_ORDER.length;
	return createTeamId(TURN_ORDER[nextIndex]);
}
