import type { Chunk, DataId } from "#/routes/match/$matchId/-game/store/consts.ts";

export function getData(dataId: DataId, chunk: Chunk) {
	const item = chunk.data.get(dataId);
	if (!item) {
		throw new Error(`Data with id ${dataId} not found in chunk ${chunk.id}`);
	}

	return item;
}
