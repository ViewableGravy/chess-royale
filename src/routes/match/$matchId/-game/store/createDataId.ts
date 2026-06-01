import type { DataId } from "#/routes/match/$matchId/-game/store/consts.ts";

export function createDataId(s: string): DataId {
	return s as DataId;
}
