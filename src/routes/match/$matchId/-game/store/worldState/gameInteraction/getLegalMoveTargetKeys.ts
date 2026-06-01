import { loadGameConfig } from "#/assets/config/loadGameConfig.ts";
import type { Chunks } from "#/routes/match/$matchId/-game/store/consts.ts";
import { getData } from "#/routes/match/$matchId/-game/store/actions/getData.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { canLocalPlayerAct } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import { getBoardOccupancy } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/getBoardOccupancy.ts";
import type { WorldState } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";
import { getPredictedMoves } from "#/routes/match/$matchId/-game/utils/getPredictedMoves.ts";
import {
	gridCoordKey,
	type GridCoord,
} from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

export const EMPTY_LEGAL_MOVE_TARGET_KEYS = new Set<string>();

export function getLegalMoveTargetKeys(
	worldState: Pick<
		WorldState,
		"selectedPiece" | "activeTeamId" | "localPlayerTeamId" | "closingZone"
	>,
	chunks: Chunks,
): ReadonlySet<string> {
	const { selectedPiece } = worldState;

	if (!selectedPiece || !canLocalPlayerAct(worldState)) {
		return EMPTY_LEGAL_MOVE_TARGET_KEYS;
	}

	const pieceData = getData(
		selectedPiece.dataId,
		ChunkStore.actions.getChunk(selectedPiece.chunkId, chunks),
	);

	if (pieceData.attributes.teamId !== worldState.activeTeamId) {
		return EMPTY_LEGAL_MOVE_TARGET_KEYS;
	}

	const { occupiedSquares, squareTeams } = getBoardOccupancy(chunks, {
		dataId: selectedPiece.dataId,
		chunkId: selectedPiece.chunkId,
	});

	const config = loadGameConfig();
	const legalMoves = getPredictedMoves({
		piece: pieceData.attributes.piece,
		x: pieceData.attributes.x,
		y: pieceData.attributes.y,
		teamId: pieceData.attributes.teamId,
		boardSize: config.board.size,
		occupied: occupiedSquares,
		squareTeams,
		removed: worldState.closingZone.removed,
	});

	const keys = new Set<string>();
	for (const move of legalMoves) {
		keys.add(gridCoordKey(move));
	}

	return keys;
}

export function isCoordLegalMoveTarget(
	target: GridCoord,
	worldState: Pick<
		WorldState,
		"selectedPiece" | "activeTeamId" | "localPlayerTeamId" | "closingZone"
	>,
	chunks: Chunks,
): boolean {
	return getLegalMoveTargetKeys(worldState, chunks).has(
		gridCoordKey(target),
	);
}
