import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { ChunkIdContext, DataIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";

/***** COMPONENT START *****/
export const GameFiberNode = () => {

  const chunkIds = useSelector(ChunkStore, (state) => Array.from(state.keys()));

  return (
    <ClientOnly>
      <Canvas id="game-canvas" className="game-fiber-canvas" camera={{ position: [0, 0, 3], fov: 60 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />

        <mesh rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        {chunkIds.map((chunkId) => (
          <ChunkIdContext key={chunkId} value={chunkId}>
            <ChunkRenderer />
          </ChunkIdContext>
        ))}
      </Canvas>
    </ClientOnly>
  )
}

function ChunkRenderer() {
  const chunkId = useInvariantContext(ChunkIdContext);
  const chunk = useSelector(ChunkStore, (state) => ChunkStore.getChunk(chunkId, state));
  
  return (
    <>
      {Array.from(chunk.data.entries()).map(([dataId, data]) => (
        <DataIdContext key={dataId} value={dataId}>
          <DataRenderer />
        </DataIdContext>
      ))}
    </>
  );
};


function DataRenderer() {
  const chunkId = useInvariantContext(ChunkIdContext);
  const dataId = useInvariantContext(DataIdContext);

  const data = useSelector(ChunkStore, (state) => ChunkStore.getData(dataId, ChunkStore.getChunk(chunkId, state)));

  return (
    <mesh position={[data.attributes.x ?? 1, data.attributes.y ?? 1, 0]} rotation={[0.4, 0.4, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="#c52222" />
    </mesh>
  );
}