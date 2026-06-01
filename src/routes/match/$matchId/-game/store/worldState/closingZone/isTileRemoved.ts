import type { ClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function isTileRemoved(
	key: string,
	closingZone: ClosingZoneState,
): boolean {
	return closingZone.removed.has(key);
}
