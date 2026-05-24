import { ChunkIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { ChunkRenderer } from "./components/ChunkRenderer";

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
