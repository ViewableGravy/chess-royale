import {
	CLOSING_ZONE_TILES_PER_MARK,
	type WarningLevel,
} from "#/routes/match/$matchId/-game/store/worldState/consts.ts";
import { getRingTileKeys } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getRingTileKeys.ts";
import { pickRandomTiles } from "#/routes/match/$matchId/-game/store/worldState/closingZone/pickRandomTiles.ts";

export function markNewWarnings(
	warnings: Map<string, WarningLevel>,
	removed: Set<string>,
	activeRing: number,
	boardSize: number,
): Map<string, WarningLevel> {
	const eligible = getRingTileKeys(activeRing, boardSize, removed).filter(
		(key) => !warnings.has(key),
	);

	const count = Math.min(CLOSING_ZONE_TILES_PER_MARK, eligible.length);
	const picked = pickRandomTiles(eligible, count);
	const nextWarnings = new Map(warnings);

	for (const key of picked) {
		nextWarnings.set(key, 1);
	}

	return nextWarnings;
}
