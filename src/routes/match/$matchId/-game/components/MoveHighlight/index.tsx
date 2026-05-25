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
					config.board.squareSize * 0.85,
					config.board.squareSize * 0.85,
					0.01,
				]}
			/>
			<meshStandardMaterial
				color={config.piece.moveHighlightColor}
				opacity={0.55}
				transparent
			/>
		</mesh>
	);
};
