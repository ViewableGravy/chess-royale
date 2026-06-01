import { getMaxRingIndex } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getMaxRingIndex.ts";
import { isRingFullyRemoved } from "#/routes/match/$matchId/-game/store/worldState/closingZone/isRingFullyRemoved.ts";

export function resolveActiveRing(
	activeRing: number,
	removed: Set<string>,
	boardSize: number,
): number {
	let ring = activeRing;
	const maxRing = getMaxRingIndex(boardSize);

	while (ring <= maxRing && isRingFullyRemoved(ring, boardSize, removed)) {
		ring += 1;
	}

	return ring;
}
