import type React from "react";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
type BoardSquareTile = React.FC<{
	color: string;
	position: [number, number, number];
	squareSize: number;
	squareDepth: number;
}>;

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
/** Static board tile mesh — no store subscriptions; updates only when props change. */
export const BoardSquareTile: BoardSquareTile = ({ color, position, squareSize, squareDepth }) => {
	return (
		<mesh position={position}>
			<boxGeometry args={[squareSize, squareDepth, squareSize]} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
};
