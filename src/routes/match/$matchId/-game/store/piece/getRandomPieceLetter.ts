import { PIECE_LETTERS, type PieceLetter } from "../consts";

/**
 * Gets a random piece letter.
 * @returns A random piece letter.
 */
export function getRandomPieceLetter(): PieceLetter {
	return PIECE_LETTERS[Math.floor(Math.random() * PIECE_LETTERS.length)];
}
