import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { BoardSquarePick } from "#/routes/match/$matchId/-game/components/BoardSquarePick/index.tsx";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { blendSquareColor } from "#/routes/match/$matchId/-game/store/worldState/closingZone/blendSquareColor.ts";
import { getWarningLevel } from "#/routes/match/$matchId/-game/store/worldState/closingZone/getWarningLevel.ts";
import { isTileRemoved } from "#/routes/match/$matchId/-game/store/worldState/closingZone/isTileRemoved.ts";
import { canLocalPlayerAct } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import {
	EMPTY_LEGAL_MOVE_TARGET_KEYS,
	getLegalMoveTargetKeys,
} from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/getLegalMoveTargetKeys.ts";
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
	const closingZone = useSelector(WorldStateStore, (state) => state.closingZone);
	const selectedPiece = useSelector(WorldStateStore, (state) => state.selectedPiece);
	const activeTeamId = useSelector(WorldStateStore, (state) => state.activeTeamId);
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);
	const canAct = useSelector(WorldStateStore, (state) => canLocalPlayerAct(state));
	const legalMoveTargetKeys = useSelector(
		ChunkStore,
		(chunks) => {
			if (!selectedPiece || !canAct) {
				return EMPTY_LEGAL_MOVE_TARGET_KEYS;
			}

			return getLegalMoveTargetKeys(
				{
					selectedPiece,
					activeTeamId,
					localPlayerTeamId,
					closingZone,
				},
				chunks,
			);
		},
		{
			compare: (previous, next) => {
				if (previous === next) {
					return true;
				}

				if (previous.size !== next.size) {
					return false;
				}

				for (const key of previous) {
					if (!next.has(key)) {
						return false;
					}
				}

				return true;
			},
		},
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
			{squares.map((square) => {
				const [x, y] = square.key.split(",").map(Number);

				return (
					<group key={square.key}>
						<mesh position={square.position}>
							<boxGeometry
								args={[config.board.squareSize, config.board.squareDepth, config.board.squareSize]}
							/>
							<meshStandardMaterial color={square.color} />
						</mesh>
						<BoardSquarePick
							x={x}
							y={y}
							position={square.position}
							isTarget={legalMoveTargetKeys.has(square.key)}
						/>
					</group>
				);
			})}
		</group>
	);
};
