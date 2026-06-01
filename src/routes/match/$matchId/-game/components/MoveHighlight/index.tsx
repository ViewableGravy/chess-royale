import type React from "react";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";

type MoveHighlight = React.FC<{
	x: number;
	y: number;
}>;

export const MoveHighlight: MoveHighlight = ({ x, y }) => {
	const { config, utils } = useInvariantContext(GameConfigContext);
	const position = utils.gridCoordToWorldPosition(
		x,
		y,
		config.board.squareDepth / 2 + 0.01,
	);

	return (
		<mesh position={position} raycast={() => null}>
			<boxGeometry
				args={[
					config.board.squareSize * 0.88,
					config.board.squareSize * 0.88,
					0.015,
				]}
			/>
			<meshStandardMaterial
				color={config.piece.moveHighlightColor}
				emissive={config.piece.moveHighlightColor}
				emissiveIntensity={0.45}
				opacity={config.piece.moveHighlightOpacity}
				transparent
			/>
		</mesh>
	);
};
