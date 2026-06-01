import type { TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";

export function createTeamId(s: string): TeamId {
	return s as TeamId;
}
