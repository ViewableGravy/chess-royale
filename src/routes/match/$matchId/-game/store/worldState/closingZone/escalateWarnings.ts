import {
	MAX_WARNING_LEVEL,
	type ClosingZoneState,
	type WarningLevel,
} from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

export function escalateWarnings(closingZone: ClosingZoneState): {
	warnings: Map<string, WarningLevel>;
	removed: Set<string>;
} {
	const warnings = new Map(closingZone.warnings);
	const removed = new Set(closingZone.removed);

	for (const [key, level] of closingZone.warnings) {
		if (level >= MAX_WARNING_LEVEL) {
			warnings.delete(key);
			removed.add(key);
		} else {
			warnings.set(key, (level + 1) as WarningLevel);
		}
	}

	return { warnings, removed };
}
