import { batch } from "@tanstack/react-store";
import type { ChunkId, DataId, TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { getData } from "#/routes/match/$matchId/-game/store/actions/getData.ts";
import { advanceActiveTeam } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/advanceActiveTeam.ts";
import { canLocalPlayerAct } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import { findDataAtCoord } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/findDataAtCoord.ts";
import { isCoordLegalMoveTarget } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/getLegalMoveTargetKeys.ts";
import type { SelectedPiece } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import type { GridCoord } from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

function getSelectedPieceTeamId(selected: SelectedPiece): TeamId {
	const pieceData = getData(
		selected.dataId,
		ChunkStore.actions.getChunk(selected.chunkId, ChunkStore.state),
	);
	return pieceData.attributes.teamId;
}

export function tryMoveSelectedPiece(target: GridCoord): boolean {
	const state = WorldStateStore.state;
	const { selectedPiece } = state;

	if (!selectedPiece || !canLocalPlayerAct(state)) {
		return false;
	}

	if (getSelectedPieceTeamId(selectedPiece) !== state.activeTeamId) {
		return false;
	}

	if (!isCoordLegalMoveTarget(target, state, ChunkStore.state)) {
		return false;
	}

	const chunks = ChunkStore.state;
	const pieceData = getData(
		selectedPiece.dataId,
		ChunkStore.actions.getChunk(selectedPiece.chunkId, chunks),
	);

	const captured = findDataAtCoord(chunks, target, {
		dataId: selectedPiece.dataId,
		chunkId: selectedPiece.chunkId,
	});

	batch(() => {
		if (captured) {
			ChunkStore.actions.deleteData(captured.id);
		}

		ChunkStore.actions.updateData({
			...pieceData,
			attributes: {
				...pieceData.attributes,
				x: target.x,
				y: target.y,
			},
		});

		advanceActiveTeam();
	});

	return true;
}

export function selectPiece(selection: SelectedPiece): void {
	const state = WorldStateStore.state;

	if (!canLocalPlayerAct(state)) {
		return;
	}

	if (getSelectedPieceTeamId(selection) !== state.activeTeamId) {
		return;
	}

	WorldStateStore.setState((prev) => ({
		...prev,
		selectedPiece: selection,
	}));
}

export function clearSelectedPiece(): void {
	WorldStateStore.setState((prev) => ({
		...prev,
		selectedPiece: null,
	}));
}

export function isSquareLegalMoveTarget(target: GridCoord): boolean {
	const state = WorldStateStore.state;
	return isCoordLegalMoveTarget(target, state, ChunkStore.state);
}

export function isPieceSelected(dataId: DataId, chunkId: ChunkId): boolean {
	const { selectedPiece } = WorldStateStore.state;
	return (
		selectedPiece !== null && selectedPiece.dataId === dataId && selectedPiece.chunkId === chunkId
	);
}
