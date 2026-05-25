import { useSelector } from "@tanstack/react-store";
import { useState } from "react";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { PieceLabel } from "#/routes/match/$matchId/-game/components/PieceLabel/index.tsx";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import {
	ChunkIdContext,
	DataIdContext,
} from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";

export const DataRenderer = () => {
	const chunkId = useInvariantContext(ChunkIdContext);
	const dataId = useInvariantContext(DataIdContext);
	const { config, utils } = useInvariantContext(GameConfigContext);
	const [hovered, setHovered] = useState(false);

	const data = useSelector(ChunkStore, (state) =>
		ChunkStore.getData(dataId, ChunkStore.getChunk(chunkId, state)),
	);

	const position = utils.gridCoordToWorldPosition(
		data.attributes.x,
		data.attributes.y,
	);

	const color = hovered ? config.piece.hoverColor : data.attributes.color;

	return (
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
	);
};
