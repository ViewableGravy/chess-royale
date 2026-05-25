import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";

type Square = {
	key: string;
	color: string;
	position: [number, number, number];
};

export const ChessBoardFlatMeshes = () => {
	const { config, utils } = useInvariantContext(GameConfigContext);
	const { lightSquareColor, darkSquareColor } = config.board;

	const squares: Square[] = [];

	for (let row = 0; row < config.board.size; row += 1) {
		for (let col = 0; col < config.board.size; col += 1) {
			const topLeft = utils.getSquareTopLeft(row, col);
			const center = utils.getSquareCenterFromTopLeft(topLeft);
			const isLight = (row + col) % 2 === 0;

			squares.push({
				key: `${row}-${col}`,
				color: isLight ? lightSquareColor : darkSquareColor,
				position: center,
			});
		}
	}

	return (
		<group>
			{squares.map((square) => (
				<mesh key={square.key} position={square.position}>
					<boxGeometry
						args={[
							config.board.squareSize,
							config.board.squareSize,
							config.board.squareDepth,
						]}
					/>
					<meshStandardMaterial color={square.color} />
				</mesh>
			))}
		</group>
	);
};
