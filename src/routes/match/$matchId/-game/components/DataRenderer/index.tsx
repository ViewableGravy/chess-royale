import { useSelector } from "@tanstack/react-store";
import { useState } from "react";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { MoveHighlight } from "#/routes/match/$matchId/-game/components/MoveHighlight/index.tsx";
import { PieceLabel } from "#/routes/match/$matchId/-game/components/PieceLabel/index.tsx";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import {
	ChunkIdContext,
	DataIdContext,
} from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { getPredictedMoves } from "#/routes/match/$matchId/-game/utils/getPredictedMoves.ts";
import { gridCoordKey } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export const DataRenderer = () => {
	const chunkId = useInvariantContext(ChunkIdContext);
	const dataId = useInvariantContext(DataIdContext);
	const { config, utils } = useInvariantContext(GameConfigContext);
	const [hovered, setHovered] = useState(false);

	const data = useSelector(ChunkStore, (state) =>
		ChunkStore.getData(dataId, ChunkStore.getChunk(chunkId, state)),
	);

	const occupiedSquares = useSelector(ChunkStore, (state) => {
		const occupied = new Set<string>();

		for (const chunk of state.values()) {
			for (const entry of chunk.data.values()) {
				occupied.add(
					gridCoordKey({
						x: entry.attributes.x,
						y: entry.attributes.y,
					}),
				);
			}
		}

		return occupied;
	});

	const predictedMoves = hovered
		? getPredictedMoves({
				piece: data.attributes.piece,
				x: data.attributes.x,
				y: data.attributes.y,
				boardSize: config.board.size,
				occupied: occupiedSquares,
			})
		: [];

	const position = utils.gridCoordToWorldPosition(
		data.attributes.x,
		data.attributes.y,
	);

	const color = hovered ? config.piece.hoverColor : data.attributes.color;

	return (
		<>
			{predictedMoves.map((move) => (
				<MoveHighlight key={gridCoordKey(move)} x={move.x} y={move.y} />
			))}
			<group
				position={position}
				onPointerOut={() => {
					setHovered(false);
				}}
				onPointerOver={(event) => {
					event.stopPropagation();
					setHovered(true);
				}}
			>
				<mesh>
					<boxGeometry
						args={[config.piece.size, config.piece.size, config.piece.size]}
					/>
					<meshStandardMaterial color={color} />
				</mesh>
				<PieceLabel
					letter={data.attributes.piece}
					pieceSize={config.piece.size}
					size={config.piece.labelFontSize * 1.4}
				/>
			</group>
		</>
	);
};
