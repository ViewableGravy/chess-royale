import type { PieceLetter, TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import {
	DIAGONAL_DIRECTIONS,
	type GridCoord,
	type GridOffset,
	ORTHOGONAL_DIRECTIONS,
	gridCoordKey,
	PIECE_MOVE_PATTERNS,
} from "#/routes/match/$matchId/-game/utils/pieceMoveOffsets.ts";
import { isPlayableSquare } from "#/routes/match/$matchId/-game/utils/isPlayableSquare.ts";

type GetPredictedMovesOptions = {
	piece: PieceLetter;
	x: number;
	y: number;
	teamId: TeamId;
	boardSize: number;
	occupied: ReadonlySet<string>;
	squareTeams: ReadonlyMap<string, TeamId>;
	removed: ReadonlySet<string>;
};

function isEnemySquare(
	key: string,
	teamId: TeamId,
	squareTeams: ReadonlyMap<string, TeamId>,
): boolean {
	const occupantTeamId = squareTeams.get(key);
	return occupantTeamId !== undefined && occupantTeamId !== teamId;
}

function collectStepMoves(
	origin: GridCoord,
	offsets: readonly GridOffset[],
	boardSize: number,
	occupied: ReadonlySet<string>,
	removed: ReadonlySet<string>,
	teamId: TeamId,
	squareTeams: ReadonlyMap<string, TeamId>,
): GridCoord[] {
	const moves: GridCoord[] = [];

	for (const { dx, dy } of offsets) {
		const target = { x: origin.x + dx, y: origin.y + dy };
		const key = gridCoordKey(target);

		if (!isPlayableSquare(target, boardSize, removed)) {
			continue;
		}

		if (occupied.has(key)) {
			if (isEnemySquare(key, teamId, squareTeams)) {
				moves.push(target);
			}

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
	removed: ReadonlySet<string>,
	teamId: TeamId,
	squareTeams: ReadonlyMap<string, TeamId>,
): GridCoord[] {
	const moves: GridCoord[] = [];

	for (const { dx, dy } of directions) {
		let step = 1;

		while (true) {
			const target = { x: origin.x + dx * step, y: origin.y + dy * step };
			const key = gridCoordKey(target);

			if (!isPlayableSquare(target, boardSize, removed)) {
				break;
			}

			if (occupied.has(key)) {
				if (isEnemySquare(key, teamId, squareTeams)) {
					moves.push(target);
				}

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
	removed: ReadonlySet<string>,
	teamId: TeamId,
	squareTeams: ReadonlyMap<string, TeamId>,
): GridCoord[] {
	const moves: GridCoord[] = [];

	for (const { dx, dy } of ORTHOGONAL_DIRECTIONS) {
		const target = { x: origin.x + dx, y: origin.y + dy };
		const key = gridCoordKey(target);

		if (
			!isPlayableSquare(target, boardSize, removed) ||
			occupied.has(key)
		) {
			continue;
		}

		moves.push(target);
	}

	for (const { dx, dy } of DIAGONAL_DIRECTIONS) {
		const target = { x: origin.x + dx, y: origin.y + dy };
		const key = gridCoordKey(target);

		if (
			!isPlayableSquare(target, boardSize, removed) ||
			!isEnemySquare(key, teamId, squareTeams)
		) {
			continue;
		}

		moves.push(target);
	}

	return moves;
}

export function getPredictedMoves({
	piece,
	x,
	y,
	teamId,
	boardSize,
	occupied,
	squareTeams,
	removed,
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
				removed,
				teamId,
				squareTeams,
			);
		case "rays":
			return collectRayMoves(
				origin,
				pattern.directions,
				boardSize,
				occupied,
				removed,
				teamId,
				squareTeams,
			);
		case "pawn":
			return collectPawnMoves(
				origin,
				boardSize,
				occupied,
				removed,
				teamId,
				squareTeams,
			);
	}
}
