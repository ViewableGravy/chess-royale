export function getRingIndex(x: number, y: number, boardSize: number): number {
	return Math.min(x, y, boardSize - 1 - x, boardSize - 1 - y);
}
