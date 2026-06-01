import type React from "react";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
export type GridPickCoord = {
	x: number;
	y: number;
};

type BoardSquarePick = React.FC<{
	x: number;
	y: number;
	position: [number, number, number];
	isTarget: boolean;
	pickActive: boolean;
	onPick: (coord: GridPickCoord) => void;
}>;

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
/** Invisible pick surface — props only; parent owns selection state. */
export const BoardSquarePick: BoardSquarePick = ({
	x,
	y,
	position,
	isTarget,
	pickActive,
	onPick,
}) => {
	const { config } = useInvariantContext(GameConfigContext);

	const handleClick = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();

		if (!pickActive) {
			return;
		}

		onPick({ x, y });
	};

	return (
		<mesh
			position={[position[0], position[1] + config.board.squareDepth / 2 + 0.02, position[2]]}
			onClick={handleClick}
		>
			<boxGeometry args={[config.board.squareSize * 0.98, 0.02, config.board.squareSize * 0.98]} />
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
