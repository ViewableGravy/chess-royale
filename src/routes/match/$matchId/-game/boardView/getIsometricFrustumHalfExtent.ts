import type { GameConfig } from "#/assets/config/loadGameConfig.ts";

/** Half-height of the orthographic frustum in world units (fits the board diamond). */
export function getIsometricFrustumHalfExtent(config: GameConfig): number {
	const boardHalfExtent = (config.board.size * config.board.squareSize) / 2;

	return boardHalfExtent * Math.SQRT2 * config.camera.fitPadding;
}
