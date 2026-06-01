import type { Attributes } from "#/routes/match/$matchId/-game/store/consts.ts";
import { getTeamColor } from "#/routes/match/$matchId/-game/store/teams/getTeamColor.ts";

export function withTeamAttributes(
	attributes: Pick<Attributes, "x" | "y" | "piece" | "teamId">,
): Attributes {
	return {
		...attributes,
		color: getTeamColor(attributes.teamId),
	};
}
