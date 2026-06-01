import { createContext, type ReactNode } from "react";
import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import {
	type BoardSquareDescriptor,
	buildBoardSquareDescriptors,
} from "#/routes/match/$matchId/-game/components/ChessBoard/buildBoardSquareDescriptors.ts";
import { compareClosingZone } from "#/routes/match/$matchId/-game/components/ChessBoard/compareClosingZone.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
export const BoardSquareDescriptorsContext = createContext<BoardSquareDescriptor[] | null>(null);

type BoardSquareDescriptorsProvider = React.FC<{
	children: ReactNode;
}>;

/**********************************************************************************************************
 *   COMPONENT START
 **********************************************************************************************************/
/** Builds square layout when the closing zone changes; selection does not invalidate this list. */
export const BoardSquareDescriptorsProvider: BoardSquareDescriptorsProvider = ({ children }) => {
	const { config, utils } = useInvariantContext(GameConfigContext);
	const closingZone = useSelector(WorldStateStore, (state) => state.closingZone, {
		compare: compareClosingZone,
	});
	const squares = buildBoardSquareDescriptors(config, utils, closingZone);

	return (
		<BoardSquareDescriptorsContext value={squares}>{children}</BoardSquareDescriptorsContext>
	);
};
