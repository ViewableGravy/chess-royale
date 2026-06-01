/**
 * Creates a hex color from a number.
 * @param value
 * @returns The hex color.
 */
export function createHexColor(value: number = Math.floor(Math.random() * 0xffffff)): string {
	return `#${value.toString(16).padStart(6, "0")}`;
}
