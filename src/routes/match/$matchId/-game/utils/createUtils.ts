import type { GameConfig } from "#/assets/config/loadGameConfig.ts";
import { type GridCoord, isOnBoard } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export type Vec3 = [number, number, number];
export type Utils = ReturnType<typeof createUtils>;

export function createUtils(config: GameConfig) {
	const { size: boardSize, squareSize, squareDepth } = config.board;

	function getBoardHalfExtent(): number {
		return (boardSize * squareSize) / 2;
	}

	/** Grid lives on the XZ plane; Y is up (Three.js convention). */
	function getSquareTopLeft(row: number, col: number): Vec3 {
		const halfBoard = getBoardHalfExtent();
		return [col * squareSize - halfBoard, 0, row * squareSize - halfBoard];
	}

	function getSquareCenterFromTopLeft(topLeft: Vec3): Vec3 {
		return [topLeft[0] + squareSize / 2, squareDepth / 2, topLeft[2] + squareSize / 2];
	}

	function getSquareCenter(row: number, col: number): Vec3 {
		return getSquareCenterFromTopLeft(getSquareTopLeft(row, col));
	}

	function gridCoordToWorldPosition(
		col: number,
		row: number,
		y = squareDepth / 2 + config.piece.size / 2,
	): Vec3 {
		const center = getSquareCenter(row, col);
		return [center[0], y, center[2]];
	}

	function worldPositionToGridCoord(worldX: number, worldZ: number): GridCoord | null {
		const halfBoard = getBoardHalfExtent();
		const col = Math.floor((worldX + halfBoard) / squareSize);
		const row = Math.floor((worldZ + halfBoard) / squareSize);
		const coord = { x: col, y: row };

		if (!isOnBoard(coord, boardSize)) {
			return null;
		}

		return coord;
	}

	return {
		getBoardHalfExtent,
		getSquareTopLeft,
		getSquareCenterFromTopLeft,
		getSquareCenter,
		gridCoordToWorldPosition,
		worldPositionToGridCoord,
	};
}
