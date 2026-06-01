import {
	TEAM_IDS,
	type TeamId,
	type TeamName,
} from "#/routes/match/$matchId/-game/store/consts.ts";

/**
 * Y-axis yaw so the local team's home edge sits at the bottom-left of the screen.
 * Board layout: south = min Z, north = max Z, west = min X, east = max X.
 */
const BOARD_VIEW_YAW = {
	south: Math.PI,
	north: 0,
	west: Math.PI / 2,
	east: -Math.PI / 2,
} as const satisfies Record<TeamName, number>;

function isTeamName(teamId: string): teamId is TeamName {
	return (TEAM_IDS as readonly string[]).includes(teamId);
}

export function getBoardViewYaw(teamId: TeamId): number {
	if (!isTeamName(teamId)) {
		return BOARD_VIEW_YAW.south;
	}

	const teamName: TeamName = teamId;
	return BOARD_VIEW_YAW[teamName];
}
