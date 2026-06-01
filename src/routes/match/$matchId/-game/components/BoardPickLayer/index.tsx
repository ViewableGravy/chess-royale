import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import {
	BoardSquarePick,
	type GridPickCoord,
} from "#/routes/match/$matchId/-game/components/BoardSquarePick/index.tsx";
import { BoardSquareDescriptorsContext } from "#/routes/match/$matchId/-game/components/ChessBoard/BoardSquareDescriptorsContext.tsx";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { canLocalPlayerAct } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import {
	EMPTY_LEGAL_MOVE_TARGET_KEYS,
	getLegalMoveTargetKeys,
} from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/getLegalMoveTargetKeys.ts";
import {
	clearSelectedPiece,
	tryMoveSelectedPiece,
} from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/tryMoveSelectedPiece.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
/** Pick surfaces only — re-renders when selection / legal moves change, not when tiles do. */
export const BoardPickLayer = () => {
	const squares = useInvariantContext(BoardSquareDescriptorsContext);
	const selectedPiece = useSelector(WorldStateStore, (state) => state.selectedPiece);
	const activeTeamId = useSelector(WorldStateStore, (state) => state.activeTeamId);
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);
	const closingZone = useSelector(WorldStateStore, (state) => state.closingZone);
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

	const pickActive = selectedPiece !== null && canAct;

	const handlePick = (coord: GridPickCoord) => {
		if (!pickActive) {
			return;
		}

		if (tryMoveSelectedPiece(coord)) {
			return;
		}

		clearSelectedPiece();
	};

	return (
		<group>
			{squares.map((square) => (
				<BoardSquarePick
					key={square.key}
					x={square.x}
					y={square.y}
					position={square.position}
					isTarget={legalMoveTargetKeys.has(square.key)}
					pickActive={pickActive}
					onPick={handlePick}
				/>
			))}
		</group>
	);
};
