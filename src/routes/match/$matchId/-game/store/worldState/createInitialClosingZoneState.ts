import type { ClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function createInitialClosingZoneState(): ClosingZoneState {
	return {
		activeRing: 0,
		warnings: new Map(),
		removed: new Set(),
	};
}
