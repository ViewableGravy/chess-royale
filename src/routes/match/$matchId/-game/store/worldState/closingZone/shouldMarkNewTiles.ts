import {
	CLOSING_ZONE_FIRST_MARK_TICK,
	CLOSING_ZONE_MARK_INTERVAL,
} from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function shouldMarkNewTiles(tick: number): boolean {
	if (tick < CLOSING_ZONE_FIRST_MARK_TICK) {
		return false;
	}

	return (tick - CLOSING_ZONE_FIRST_MARK_TICK) % CLOSING_ZONE_MARK_INTERVAL === 0;
}
