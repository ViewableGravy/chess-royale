import type { GameConfig } from "#/assets/config/loadGameConfig.ts";
import { blendSquareColor } from "#/routes/match/$matchId/-game/store/worldState/closingZone/blendSquareColor.ts";
import { getWarningLevel } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getWarningLevel.ts";
import { isTileRemoved } from "#/routes/match/$matchId/-game/store/worldState/closingZone/isTileRemoved.ts";
import type { ClosingZoneState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";
import type { Utils, Vec3 } from "#/routes/match/$matchId/-game/utils/createUtils.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export type BoardSquareDescriptor = {
	key: string;
	x: number;
	y: number;
	color: string;
	position: Vec3;
};

/** Pure board layout from config + closing zone — call only when those inputs change. */
export function buildBoardSquareDescriptors(
	config: GameConfig,
	utils: Utils,
	closingZone: ClosingZoneState,
): BoardSquareDescriptor[] {
	const { size: boardSize, lightSquareColor, darkSquareColor } = config.board;
	const squares: BoardSquareDescriptor[] = [];

	for (let row = 0; row < boardSize; row += 1) {
		for (let col = 0; col < boardSize; col += 1) {
			const key = gridCoordKey({ x: col, y: row });

			if (isTileRemoved(key, closingZone)) {
				continue;
			}

			const topLeft = utils.getSquareTopLeft(row, col);
			const position = utils.getSquareCenterFromTopLeft(topLeft);
			const isLight = (row + col) % 2 === 0;
			const baseColor = isLight ? lightSquareColor : darkSquareColor;
			const warningLevel = getWarningLevel(col, row, closingZone);

			squares.push({
				key,
				x: col,
				y: row,
				color: blendSquareColor(baseColor, warningLevel),
				position,
			});
		}
	}

	return squares;
}
