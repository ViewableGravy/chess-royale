import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { ChunkIdContext, DataIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { useSelector } from "@tanstack/react-store";

export function DataRenderer() {
  const chunkId = useInvariantContext(ChunkIdContext);
  const dataId = useInvariantContext(DataIdContext);

  const data = useSelector(ChunkStore, (state) => ChunkStore.getData(dataId, ChunkStore.getChunk(chunkId, state)));

  return (
    <mesh position={[data.attributes.x ?? 1, data.attributes.y ?? 1, 1]} rotation={[0.4, 0.4, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color={data.attributes.color} />
    </mesh>
  );
}
