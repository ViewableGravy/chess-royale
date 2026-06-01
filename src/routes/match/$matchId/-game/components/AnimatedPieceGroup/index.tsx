import type React from "react";
import { useRef } from "react";
import type { Group } from "three";
import { useFrameAnimation } from "#/hooks/useFrameAnimation/index.ts";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { stepPieceWorldPosition } from "#/routes/match/$matchId/-game/pieceMotion/stepPieceWorldPosition.ts";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
type AnimatedPieceGroup = React.FC<{
	x: number;
	y: number;
	children: React.ReactNode;
}>;

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
export const AnimatedPieceGroup: AnimatedPieceGroup = ({ x, y, children }) => {
	/***** state *****/
	const pieceGroupRef = useRef<Group>(null);

	/***** context *****/
	const { utils } = useInvariantContext(GameConfigContext);

	/***** hooks *****/
	useFrameAnimation({
		initial: () => utils.gridCoordToWorldPosition(x, y),
		getTarget: () => utils.gridCoordToWorldPosition(x, y),
		step: stepPieceWorldPosition,
		apply: (worldPosition) => {
			pieceGroupRef.current?.position.set(
				worldPosition[0],
				worldPosition[1],
				worldPosition[2],
			);
		},
	});

	/***** functions *****/
	const attachPieceGroup = (node: Group) => {
		pieceGroupRef.current = node;

		const [worldX, worldY, worldZ] = utils.gridCoordToWorldPosition(x, y);
		node.position.set(worldX, worldY, worldZ);

		return () => {
			pieceGroupRef.current = null;
		};
	};

	/***** render *****/
	return <group ref={attachPieceGroup}>{children}</group>;
};
