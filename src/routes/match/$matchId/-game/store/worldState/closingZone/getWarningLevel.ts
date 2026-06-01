import type { ClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export function getWarningLevel(
	x: number,
	y: number,
	closingZone: ClosingZoneState,
): 0 | 1 | 2 | 3 | 4 | 5 {
	return closingZone.warnings.get(gridCoordKey({ x, y })) ?? 0;
}
