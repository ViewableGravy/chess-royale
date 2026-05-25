import type { PieceLetter } from "#/routes/match/$matchId/-game/store/consts.ts";

export type GridOffset = { dx: number; dy: number };

export type GridCoord = { x: number; y: number };

const ORTHOGONAL_DIRECTIONS = [
	{ dx: 0, dy: 1 },
	{ dx: 0, dy: -1 },
	{ dx: 1, dy: 0 },
	{ dx: -1, dy: 0 },
] as const satisfies readonly GridOffset[];

const DIAGONAL_DIRECTIONS = [
	{ dx: 1, dy: 1 },
	{ dx: 1, dy: -1 },
	{ dx: -1, dy: 1 },
	{ dx: -1, dy: -1 },
] as const satisfies readonly GridOffset[];

const KING_OFFSETS = [
	{ dx: -1, dy: -1 },
	{ dx: 0, dy: -1 },
	{ dx: 1, dy: -1 },
	{ dx: -1, dy: 0 },
	{ dx: 1, dy: 0 },
	{ dx: -1, dy: 1 },
	{ dx: 0, dy: 1 },
	{ dx: 1, dy: 1 },
] as const satisfies readonly GridOffset[];

const KNIGHT_OFFSETS = [
	{ dx: -2, dy: -1 },
	{ dx: -2, dy: 1 },
	{ dx: -1, dy: -2 },
	{ dx: -1, dy: 2 },
	{ dx: 1, dy: -2 },
	{ dx: 1, dy: 2 },
	{ dx: 2, dy: -1 },
	{ dx: 2, dy: 1 },
] as const satisfies readonly GridOffset[];

export type PieceMovePattern =
	| { kind: "steps"; offsets: readonly GridOffset[] }
	| { kind: "rays"; directions: readonly GridOffset[] }
	| { kind: "pawn" };

export const PIECE_MOVE_PATTERNS = {
	B: { kind: "rays", directions: DIAGONAL_DIRECTIONS },
	K: { kind: "steps", offsets: KING_OFFSETS },
	N: { kind: "steps", offsets: KNIGHT_OFFSETS },
	P: { kind: "pawn" },
	Q: {
		kind: "rays",
		directions: [...ORTHOGONAL_DIRECTIONS, ...DIAGONAL_DIRECTIONS],
	},
	R: { kind: "rays", directions: ORTHOGONAL_DIRECTIONS },
} as const satisfies Record<PieceLetter, PieceMovePattern>;

export function gridCoordKey(coord: GridCoord): string {
	return `${coord.x},${coord.y}`;
}

export function getForwardDy(y: number, boardSize: number): 1 | -1 {
	return y < boardSize / 2 ? 1 : -1;
}

export function isOnBoard(
	coord: GridCoord,
	boardSize: number,
): coord is GridCoord {
	return (
		coord.x >= 0 && coord.x < boardSize && coord.y >= 0 && coord.y < boardSize
	);
}

export function isPawnStartingRank(y: number, forwardDy: 1 | -1): boolean {
	return forwardDy === 1 ? y === 1 : y === 8;
}
