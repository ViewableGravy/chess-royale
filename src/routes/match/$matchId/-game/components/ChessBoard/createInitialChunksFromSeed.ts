import { z } from "zod";
import seed from "#/routes/match/$matchId/-game/components/ChessBoard/seed.json";
import {
	type Chunk,
	type Chunks,
	type Data,
	type DataId,
	createChunkId,
	createDataId,
	PIECE_LETTERS,
} from "#/routes/match/$matchId/-game/store/consts.ts";

const chunkIdSchema = z.string().transform(createChunkId);
const dataIdSchema = z.string().transform(createDataId);

const dataSchema = z.object({
	id: dataIdSchema,
	chunkId: chunkIdSchema,
	attributes: z.object({
		x: z.number(),
		y: z.number(),
		color: z.string(),
		piece: z.enum(PIECE_LETTERS),
	}),
});

const recordToMap = <K, V>(record: Record<string, V>, createKey: (key: string) => K) =>
	new Map(Object.entries(record).map(([key, value]) => [createKey(key), value]));

const dataMapSchema = z
	.record(z.string(), dataSchema)
	.transform((data) => recordToMap<DataId, Data>(data, createDataId));

const initialChunksSchema = z
	.record(z.string(), dataMapSchema)
	.transform((chunks): Chunks =>
		new Map(
			Object.entries(chunks).map(([chunkId, data]) => {
				const id = createChunkId(chunkId);
				return [id, { id, data } satisfies Chunk];
			}),
		),
	);

export function createInitialChunksFromSeed(): Chunks {
	return initialChunksSchema.parse(seed);
}
