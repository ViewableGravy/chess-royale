import seed from "#/routes/match/$matchId/-game/components/ChessBoard/seed.json";
import {
	type Chunks,
	createChunkId,
	createDataId,
	type Data,
	type DataId,
	type PieceLetter,
} from "#/routes/match/$matchId/-game/store/consts.ts";

type SeedPiece = {
	id: string;
	x: number;
	y: number;
	color: string;
	piece: PieceLetter;
};

type SeedFile = {
	chunkId: string;
	pieces: SeedPiece[];
};

export function createInitialChunksFromSeed(): Chunks {
	const { chunkId, pieces } = seed as SeedFile;
	const chunk = createChunkId(chunkId);
	const data = new Map<DataId, Data>();

	for (const piece of pieces) {
		const dataId = createDataId(piece.id);
		data.set(dataId, {
			id: dataId,
			chunkId: chunk,
			attributes: {
				x: piece.x,
				y: piece.y,
				color: piece.color,
				piece: piece.piece,
			},
		});
	}

	return new Map([[chunk, { id: chunk, data }]]);
}
