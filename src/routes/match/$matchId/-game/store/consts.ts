import type { Tagged } from "type-fest";

export type ChunkId = Tagged<string, 'ChunkId'>;
export type DataId = Tagged<string, 'DataId'>;

// Normalized to access id in both directions
export type Attributes = {
  x: number;
  y: number;
	color: string;
}
export type Data = { id: DataId; chunkId: ChunkId; attributes: Attributes };
export type Chunk = { id: ChunkId; data: Map<DataId, Data> };
export type Chunks = Map<ChunkId, Chunk>;

export function createDataId(s: string): DataId {
	return s as DataId;
}

export function createChunkId(s: string): ChunkId {
	return s as ChunkId;
}