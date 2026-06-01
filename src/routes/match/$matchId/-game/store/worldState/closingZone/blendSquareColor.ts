import { MAX_WARNING_LEVEL } from "#/routes/match/$matchId/-game/store/worldState/consts.ts";

const DANGER_COLOR = { r: 255, g: 68, b: 68 };

const clampColorChannel = (channel: number) => Math.max(0, Math.min(255, Math.round(channel)));

function parseHexColor(hex: string): { r: number; g: number; b: number } {
	const normalized = hex.replace("#", "");
	const value = Number.parseInt(normalized, 16);

	return {
		r: (value >> 16) & 0xff,
		g: (value >> 8) & 0xff,
		b: value & 0xff,
	};
}

function toHexColor({ r, g, b }: { r: number; g: number; b: number }): string {
	return `#${[clampColorChannel(r), clampColorChannel(g), clampColorChannel(b)]
		.map((channel) => channel.toString(16).padStart(2, "0"))
		.join("")}`;
}

export function blendSquareColor(baseColor: string, warningLevel: 0 | 1 | 2 | 3 | 4 | 5): string {
	if (warningLevel === 0) {
		return baseColor;
	}

	const base = parseHexColor(baseColor);
	const blendAmount = 0.2 + (warningLevel / MAX_WARNING_LEVEL) * 0.55;

	return toHexColor({
		r: base.r + (DANGER_COLOR.r - base.r) * blendAmount,
		g: base.g + (DANGER_COLOR.g - base.g) * blendAmount,
		b: base.b + (DANGER_COLOR.b - base.b) * blendAmount,
	});
}
