import { parse } from "smol-toml";
import { z } from "zod";
import configSource from "#/assets/config/config.toml?raw";

const vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

const gameConfigSchema = z.object({
	board: z.object({
		size: z.number().int().positive(),
		squareSize: z.number().positive(),
		lightSquareColor: z.string(),
		darkSquareColor: z.string(),
		squareDepth: z.number().positive(),
	}),
	piece: z.object({
		size: z.number().positive(),
		hoverColor: z.string(),
		moveHighlightColor: z.string(),
		moveHighlightOpacity: z.number().positive().max(1),
		labelFontSize: z.number().positive(),
	}),
	camera: z.object({
		distance: z.number().positive(),
		fitPadding: z.number().positive(),
		near: z.number().positive(),
		far: z.number().positive(),
	}),
	canvas: z.object({
		height: z.number().positive(),
		background: z.string(),
	}),
	lighting: z.object({
		ambient: z.object({
			intensity: z.number().nonnegative(),
		}),
		directional: z.object({
			position: vec3Schema,
			intensity: z.number().nonnegative(),
		}),
	}),
});

export type GameConfig = z.infer<typeof gameConfigSchema>;

let cachedGameConfig: GameConfig | undefined;

export function loadGameConfig(): GameConfig {
	if (cachedGameConfig === undefined) {
		cachedGameConfig = gameConfigSchema.parse(parse(configSource));
	}

	return cachedGameConfig;
}
