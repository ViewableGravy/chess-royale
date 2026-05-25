import type React from "react";
import {
	DARK_SQUARE_COLOR,
	DEFAULT_BOARD_SIZE,
	DEFAULT_SQUARE_SIZE,
	LIGHT_SQUARE_COLOR,
} from "#/routes/match/$matchId/-game/components/ChessBoard/consts.ts";

type Square = {
	key: string;
	color: string;
	position: [number, number, number];
};

type ChessBoardFlatMeshes = React.FC<{
  size?: number;
  squareSize?: number;
}>;

export const ChessBoardFlatMeshes: ChessBoardFlatMeshes = ({
	size = DEFAULT_BOARD_SIZE,
	squareSize = DEFAULT_SQUARE_SIZE,
}) => {
	const halfBoard = (size * squareSize) / 2;
	const squares: Square[] = [];

	for (let row = 0; row < size; row += 1) {
		for (let col = 0; col < size; col += 1) {
			const x = (col + 0.5) * squareSize - halfBoard;
			const y = (row + 0.5) * squareSize - halfBoard;
			const isLight = (row + col) % 2 === 0;

			squares.push({
				key: `${row}-${col}`,
				color: isLight ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR,
				position: [x, y, 0],
			});
		}
	}

	return (
		<group>
			{squares.map((square) => (
				<mesh key={square.key} position={square.position}>
					<boxGeometry args={[squareSize, squareSize, 0.05]} />
					<meshStandardMaterial color={square.color} />
				</mesh>
			))}
		</group>
	);
};
