import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { AnimatedPieceGroup } from "#/routes/match/$matchId/-game/components/AnimatedPieceGroup/index.tsx";
import { MoveHighlight } from "#/routes/match/$matchId/-game/components/MoveHighlight/index.tsx";
import { PieceLabel } from "#/routes/match/$matchId/-game/components/PieceLabel/index.tsx";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { ChunkIdContext, DataIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import {
	canInteractWithTeam,
	canLocalPlayerAct,
} from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import { getBoardOccupancy } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/getBoardOccupancy.ts";
import {
	clearSelectedPiece,
	isPieceSelected,
	isSquareLegalMoveTarget,
	selectPiece,
	tryMoveSelectedPiece,
} from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/tryMoveSelectedPiece.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { getPredictedMoves } from "#/routes/match/$matchId/-game/utils/getPredictedMoves.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export const DataRenderer = () => {
	const chunkId = useInvariantContext(ChunkIdContext);
	const dataId = useInvariantContext(DataIdContext);
	const { config } = useInvariantContext(GameConfigContext);

	const data = useSelector(ChunkStore, (state) =>
		ChunkStore.actions.getData(dataId, ChunkStore.actions.getChunk(chunkId, state)),
	);

	const removedTiles = useSelector(WorldStateStore, (state) => state.closingZone.removed);
	const selectedPiece = useSelector(WorldStateStore, (state) => state.selectedPiece);
	const canAct = useSelector(WorldStateStore, (state) => canLocalPlayerAct(state));
	const isOwnPiece = useSelector(WorldStateStore, (state) =>
		canInteractWithTeam(state, data.attributes.teamId),
	);

	const isSelected = isPieceSelected(dataId, chunkId);

	const { occupiedSquares, squareTeams } = useSelector(ChunkStore, (state) =>
		getBoardOccupancy(state, isSelected ? { dataId, chunkId } : undefined),
	);

	const predictedMoves = isSelected
		? getPredictedMoves({
				piece: data.attributes.piece,
				x: data.attributes.x,
				y: data.attributes.y,
				teamId: data.attributes.teamId,
				boardSize: config.board.size,
				occupied: occupiedSquares,
				squareTeams,
				removed: removedTiles,
			})
		: [];

	const color = isSelected ? config.piece.hoverColor : data.attributes.color;

	const handleClick = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();

		if (!canAct) {
			return;
		}

		if (
			selectedPiece &&
			selectedPiece.dataId !== dataId &&
			isSquareLegalMoveTarget({
				x: data.attributes.x,
				y: data.attributes.y,
			})
		) {
			tryMoveSelectedPiece({
				x: data.attributes.x,
				y: data.attributes.y,
			});
			return;
		}

		if (!isOwnPiece) {
			if (selectedPiece) {
				clearSelectedPiece();
			}
			return;
		}

		if (selectedPiece && selectedPiece.dataId === dataId && selectedPiece.chunkId === chunkId) {
			clearSelectedPiece();
			return;
		}

		selectPiece({ dataId, chunkId });
	};

	return (
		<>
			{predictedMoves.map((move) => (
				<MoveHighlight key={gridCoordKey(move)} x={move.x} y={move.y} />
			))}
			<AnimatedPieceGroup x={data.attributes.x} y={data.attributes.y}>
				<mesh onClick={handleClick}>
					<boxGeometry args={[config.piece.size, config.piece.size, config.piece.size]} />
					<meshStandardMaterial color={color} />
				</mesh>
				<PieceLabel
					letter={data.attributes.piece}
					pieceSize={config.piece.size}
					size={config.piece.labelFontSize * 1.4}
				/>
			</AnimatedPieceGroup>
		</>
	);
};
