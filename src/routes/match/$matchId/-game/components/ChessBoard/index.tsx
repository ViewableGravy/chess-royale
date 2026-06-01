import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { blendSquareColor } from "#/routes/match/$matchId/-game/store/worldState/closingZone/blendSquareColor.ts";
import { getWarningLevel } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getWarningLevel.ts";
import { isTileRemoved } from "#/routes/match/$matchId/-game/store/worldState/closingZone/isTileRemoved.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

type Square = {
	key: string;
	color: string;
	position: [number, number, number];
};

export const ChessBoardFlatMeshes = () => {
	const { config, utils } = useInvariantContext(GameConfigContext);
	const { lightSquareColor, darkSquareColor } = config.board;
	const closingZone = useSelector(
		WorldStateStore,
		(state) => state.closingZone,
	);

	const squares: Square[] = [];

	for (let row = 0; row < config.board.size; row += 1) {
		for (let col = 0; col < config.board.size; col += 1) {
			const key = gridCoordKey({ x: col, y: row });

			if (isTileRemoved(key, closingZone)) {
				continue;
			}

			const topLeft = utils.getSquareTopLeft(row, col);
			const center = utils.getSquareCenterFromTopLeft(topLeft);
			const isLight = (row + col) % 2 === 0;
			const baseColor = isLight ? lightSquareColor : darkSquareColor;
			const warningLevel = getWarningLevel(col, row, closingZone);

			squares.push({
				key,
				color: blendSquareColor(baseColor, warningLevel),
				position: center,
			});
		}
	}

	return (
		<group>
			{squares.map((square) => (
				<mesh key={square.key} position={square.position}>
					<boxGeometry
						args={[
							config.board.squareSize,
							config.board.squareSize,
							config.board.squareDepth,
						]}
					/>
					<meshStandardMaterial color={square.color} />
				</mesh>
			))}
		</group>
	);
};
