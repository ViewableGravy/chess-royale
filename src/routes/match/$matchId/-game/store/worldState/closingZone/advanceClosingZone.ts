import type { ClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";
import { escalateWarnings } from "#/routes/match/$matchId/-game/store/worldState/closingZone/escalateWarnings.ts";
import { getMaxRingIndex } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getMaxRingIndex.ts";
import { markNewWarnings } from "#/routes/match/$matchId/-game/store/worldState/closingZone/markNewWarnings.ts";
import { resolveActiveRing } from "#/routes/match/$matchId/-game/store/worldState/closingZone/resolveActiveRing.ts";
import { shouldMarkNewTiles } from "#/routes/match/$matchId/-game/store/worldState/closingZone/shouldMarkNewTiles.ts";

export function advanceClosingZone(
	closingZone: ClosingZoneState,
	boardSize: number,
	tick: number,
): ClosingZoneState {
	const { warnings, removed } = escalateWarnings(closingZone);
	let activeRing = resolveActiveRing(
		closingZone.activeRing,
		removed,
		boardSize,
	);

	const maxRing = getMaxRingIndex(boardSize);
	if (activeRing > maxRing) {
		return { activeRing, warnings, removed };
	}

	const nextWarnings = shouldMarkNewTiles(tick)
		? markNewWarnings(warnings, removed, activeRing, boardSize)
		: warnings;

	return { activeRing, warnings: nextWarnings, removed };
}
