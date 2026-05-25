import type { PieceLetter } from "#/routes/match/$matchId/-game/store/consts.ts";
import {
	type GridCoord,
	type GridOffset,
	getForwardDy,
	gridCoordKey,
	isOnBoard,
	isPawnStartingRank,
	PIECE_MOVE_PATTERNS,
} from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";

type GetPredictedMovesOptions = {
	piece: PieceLetter;
	x: number;
	y: number;
	boardSize: number;
	occupied: ReadonlySet<string>;
};

function collectStepMoves(
	origin: GridCoord,
	offsets: readonly GridOffset[],
	boardSize: number,
	occupied: ReadonlySet<string>,
): GridCoord[] {
	const moves: GridCoord[] = [];

	for (const { dx, dy } of offsets) {
		const target = { x: origin.x + dx, y: origin.y + dy };
		if (!isOnBoard(target, boardSize) || occupied.has(gridCoordKey(target))) {
			continue;
		}

		moves.push(target);
	}

	return moves;
}

function collectRayMoves(
	origin: GridCoord,
	directions: readonly GridOffset[],
	boardSize: number,
	occupied: ReadonlySet<string>,
): GridCoord[] {
	const moves: GridCoord[] = [];

	for (const { dx, dy } of directions) {
		let step = 1;

		while (true) {
			const target = { x: origin.x + dx * step, y: origin.y + dy * step };
			if (!isOnBoard(target, boardSize)) {
				break;
			}

			if (occupied.has(gridCoordKey(target))) {
				break;
			}

			moves.push(target);
			step += 1;
		}
	}

	return moves;
}

function collectPawnMoves(
	origin: GridCoord,
	boardSize: number,
	occupied: ReadonlySet<string>,
): GridCoord[] {
	const forwardDy = getForwardDy(origin.y, boardSize);
	const oneStep = { x: origin.x, y: origin.y + forwardDy };

	if (!isOnBoard(oneStep, boardSize) || occupied.has(gridCoordKey(oneStep))) {
		return [];
	}

	const moves: GridCoord[] = [oneStep];

	if (!isPawnStartingRank(origin.y, forwardDy)) {
		return moves;
	}

	const twoStep = { x: origin.x, y: origin.y + forwardDy * 2 };
	if (isOnBoard(twoStep, boardSize) && !occupied.has(gridCoordKey(twoStep))) {
		moves.push(twoStep);
	}

	return moves;
}

export function getPredictedMoves({
	piece,
	x,
	y,
	boardSize,
	occupied,
}: GetPredictedMovesOptions): GridCoord[] {
	const origin = { x, y };
	const pattern = PIECE_MOVE_PATTERNS[piece];

	switch (pattern.kind) {
		case "steps":
			return collectStepMoves(
				origin,
				pattern.offsets,
				boardSize,
				occupied,
			);
		case "rays":
			return collectRayMoves(
				origin,
				pattern.directions,
				boardSize,
				occupied,
			);
		case "pawn":
			return collectPawnMoves(origin, boardSize, occupied);
	}
}
