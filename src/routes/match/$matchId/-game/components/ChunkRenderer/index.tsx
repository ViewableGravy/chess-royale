import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import {
	ChunkIdContext,
	DataIdContext,
} from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { DataRenderer } from "../DataRenderer";

export const ChunkRenderer = () => {
	const chunkId = useInvariantContext(ChunkIdContext);
	const chunk = useSelector(ChunkStore, (state) =>
		ChunkStore.getChunk(chunkId, state),
	);

	return (
		<>
			{Array.from(chunk.data.keys()).map((dataId) => (
				<DataIdContext key={dataId} value={dataId}>
					<DataRenderer />
				</DataIdContext>
			))}
		</>
	);
};
