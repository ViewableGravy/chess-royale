import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { BoardSquareTile } from "#/routes/match/$matchId/-game/components/BoardSquareTile/index.tsx";
import { BoardSquareDescriptorsContext } from "#/routes/match/$matchId/-game/components/ChessBoard/BoardSquareDescriptorsContext.tsx";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
/** Tile meshes only — does not re-render on piece selection. */
export const BoardTilesLayer = () => {
	const { config } = useInvariantContext(GameConfigContext);
	const squares = useInvariantContext(BoardSquareDescriptorsContext);
	const { squareSize, squareDepth } = config.board;

	return (
		<group>
			{squares.map((square) => (
				<BoardSquareTile
					key={square.key}
					color={square.color}
					position={square.position}
					squareDepth={squareDepth}
					squareSize={squareSize}
				/>
			))}
		</group>
	);
};
