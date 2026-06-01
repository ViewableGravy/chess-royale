import {
	TEAM_COLORS,
	type TeamId,
	type TeamName,
} from "#/routes/match/$matchId/-game/store/consts.ts";

export function getTeamColor(teamId: TeamId): string {
	return TEAM_COLORS[teamId as TeamName];
}
