import type { ClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

function setsEqual(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
	if (a.size !== b.size) {
		return false;
	}

	for (const value of a) {
		if (!b.has(value)) {
			return false;
		}
	}

	return true;
}

function warningMapsEqual(
	a: ReadonlyMap<string, number>,
	b: ReadonlyMap<string, number>,
): boolean {
	if (a.size !== b.size) {
		return false;
	}

	for (const [key, level] of a) {
		if (b.get(key) !== level) {
			return false;
		}
	}

	return true;
}

/** Stable `useSelector` compare for `WorldStateStore` closing-zone slices. */
export function compareClosingZone(previous: ClosingZoneState, next: ClosingZoneState): boolean {
	return (
		previous.activeRing === next.activeRing &&
		setsEqual(previous.removed, next.removed) &&
		warningMapsEqual(previous.warnings, next.warnings)
	);
}
