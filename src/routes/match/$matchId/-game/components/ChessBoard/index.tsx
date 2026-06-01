import { BoardPickLayer } from "#/routes/match/$matchId/-game/components/BoardPickLayer/index.tsx";
import { BoardTilesLayer } from "#/routes/match/$matchId/-game/components/BoardTilesLayer/index.tsx";
import { BoardSquareDescriptorsProvider } from "#/routes/match/$matchId/-game/components/ChessBoard/BoardSquareDescriptorsContext.tsx";

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
export const ChessBoardFlatMeshes = () => {
	return (
		<BoardSquareDescriptorsProvider>
			<BoardTilesLayer />
			<BoardPickLayer />
		</BoardSquareDescriptorsProvider>
	);
};
