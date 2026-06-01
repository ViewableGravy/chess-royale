import type React from "react";
import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { canLocalPlayerAct } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import {
	clearSelectedPiece,
	tryMoveSelectedPiece,
} from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/tryMoveSelectedPiece.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";

type BoardSquarePick = React.FC<{
	x: number;
	y: number;
	position: [number, number, number];
	isTarget: boolean;
}>;

export const BoardSquarePick: BoardSquarePick = ({
	x,
	y,
	position,
	isTarget,
}) => {
	const { config } = useInvariantContext(GameConfigContext);
	const selectedPiece = useSelector(
		WorldStateStore,
		(state) => state.selectedPiece,
	);
	const canAct = useSelector(WorldStateStore, (state) =>
		canLocalPlayerAct(state),
	);

	const handleClick = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();

		if (!selectedPiece || !canAct) {
			return;
		}

		if (tryMoveSelectedPiece({ x, y })) {
			return;
		}

		clearSelectedPiece();
	};

	return (
		<mesh
			position={[
				position[0],
				position[1],
				position[2] + config.board.squareDepth / 2 + 0.02,
			]}
			onClick={handleClick}
		>
			<boxGeometry
				args={[
					config.board.squareSize * 0.98,
					config.board.squareSize * 0.98,
					0.02,
				]}
			/>
			<meshStandardMaterial
				transparent
				opacity={isTarget ? config.piece.moveHighlightOpacity * 0.45 : 0}
				color={config.piece.moveHighlightColor}
				emissive={config.piece.moveHighlightColor}
				emissiveIntensity={isTarget ? 0.35 : 0}
				depthWrite={false}
			/>
		</mesh>
	);
};
