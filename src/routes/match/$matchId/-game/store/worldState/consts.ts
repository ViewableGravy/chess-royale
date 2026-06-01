export const MAX_WARNING_LEVEL = 5;

export type WarningLevel = 1 | 2 | 3 | 4 | 5;

/** First tick that may add new destruction markers (after this many ticks with none). */
export const CLOSING_ZONE_FIRST_MARK_TICK = 11;

/** Add new markers every N ticks once marking has started. */
export const CLOSING_ZONE_MARK_INTERVAL = 3;

/** Tiles newly marked for destruction on each mark tick. */
export const CLOSING_ZONE_TILES_PER_MARK = 2;

export type ClosingZoneState = {
	activeRing: number;
	warnings: Map<string, WarningLevel>;
	removed: Set<string>;
};

export type WorldState = {
	tick: number;
	boardSize: number;
	closingZone: ClosingZoneState;
};
