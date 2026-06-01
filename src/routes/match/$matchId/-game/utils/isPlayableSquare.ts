import {
	type GridCoord,
	gridCoordKey,
	isOnBoard,
} from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export function isPlayableSquare(
	coord: GridCoord,
	boardSize: number,
	removed: ReadonlySet<string>,
): boolean {
	return isOnBoard(coord, boardSize) && !removed.has(gridCoordKey(coord));
}
