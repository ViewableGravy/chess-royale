import type { Tagged } from "type-fest";

export type ChunkId = Tagged<string, "ChunkId">;
export type DataId = Tagged<string, "DataId">;

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
	color: string;
	piece: PieceLetter;
};
export type Data = { id: DataId; chunkId: ChunkId; attributes: Attributes };
export type Chunk = { id: ChunkId; data: Map<DataId, Data> };
export type Chunks = Map<ChunkId, Chunk>;

export function createDataId(s: string): DataId {
	return s as DataId;
}

export function createChunkId(s: string): ChunkId {
	return s as ChunkId;
}
