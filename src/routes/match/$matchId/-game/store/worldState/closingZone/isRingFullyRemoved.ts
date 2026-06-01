import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";
import { getRingIndex } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getRingIndex.ts";

export function isRingFullyRemoved(
	ringIndex: number,
	boardSize: number,
	removed: ReadonlySet<string>,
): boolean {
	for (let y = 0; y < boardSize; y += 1) {
		for (let x = 0; x < boardSize; x += 1) {
			if (getRingIndex(x, y, boardSize) !== ringIndex) {
				continue;
			}

			if (!removed.has(gridCoordKey({ x, y }))) {
				return false;
			}
		}
	}

	return true;
}
