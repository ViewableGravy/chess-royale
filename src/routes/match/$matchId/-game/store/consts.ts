import type { Tagged } from "type-fest";

export type ChunkId = Tagged<string, "ChunkId">;
export type DataId = Tagged<string, "DataId">;
export type TeamId = Tagged<string, "TeamId">;

export const TEAM_IDS = ["south", "north", "west", "east"] as const;

export type TeamName = (typeof TEAM_IDS)[number];

export const TEAM_COLORS: Record<TeamName, string> = {
	south: "#e2e8f0",
	north: "#1e293b",
	west: "#fecaca",
	east: "#bfdbfe",
};

export type PieceLetter = "B" | "K" | "N" | "P" | "Q" | "R";

export const PIECE_LETTERS = [
	"B",
	"K",
	"N",
	"P",
	"Q",
	"R",
] as const satisfies readonly PieceLetter[];

// Normalized to access id in both directions
export type Attributes = {
	x: number;
	y: number;
	teamId: TeamId;
	color: string;
	piece: PieceLetter;
};
export type Data = { id: DataId; chunkId: ChunkId; attributes: Attributes };
export type Chunk = { id: ChunkId; data: Map<DataId, Data> };
export type Chunks = Map<ChunkId, Chunk>;
