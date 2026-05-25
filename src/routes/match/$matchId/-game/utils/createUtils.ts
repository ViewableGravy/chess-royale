import type { GameConfig } from "#/assets/config/loadGameConfig.ts";

export type Vec3 = [number, number, number];
export type Utils = ReturnType<typeof createUtils>;

export function createUtils(config: GameConfig) {
	const { size: boardSize, squareSize } = config.board;

	function getBoardHalfExtent(): number {
		return (boardSize * squareSize) / 2;
	}

	function getSquareTopLeft(row: number, col: number): Vec3 {
		const halfBoard = getBoardHalfExtent();
		return [col * squareSize - halfBoard, row * squareSize - halfBoard, 0];
	}

	function getSquareCenterFromTopLeft(topLeft: Vec3): Vec3 {
		return [
			topLeft[0] + squareSize / 2,
			topLeft[1] + squareSize / 2,
			topLeft[2],
		];
	}

	function getSquareCenter(row: number, col: number): Vec3 {
		return getSquareCenterFromTopLeft(getSquareTopLeft(row, col));
	}

	function gridCoordToWorldPosition(
		col: number,
		row: number,
		z = config.piece.size / 2 + config.board.squareDepth / 2,
	): Vec3 {
		const center = getSquareCenter(row, col);
		return [center[0], center[1], z];
	}

	return {
		getBoardHalfExtent,
		getSquareTopLeft,
		getSquareCenterFromTopLeft,
		getSquareCenter,
		gridCoordToWorldPosition,
	};
}
