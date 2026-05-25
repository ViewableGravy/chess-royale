import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { ChunkIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { ChessBoardFlatMeshes } from "./components/ChessBoard/index.tsx";
import { ChunkRenderer } from "./components/ChunkRenderer";

/***** COMPONENT START *****/
export const GameFiberNode = () => {
	const { config } = useInvariantContext(GameConfigContext);
	const chunkIds = useSelector(ChunkStore, (state) => Array.from(state.keys()));

	return (
		<ClientOnly>
			<Canvas
				dpr={[1, 1.5]}
				id="game-canvas"
				style={{ height: `${config.canvas.height}px` }}
				camera={{
					position: config.camera.position,
					fov: config.camera.fov,
				}}
			>
				<color attach="background" args={[config.canvas.background]} />
				<ambientLight intensity={config.lighting.ambient.intensity} />
				<directionalLight
					position={config.lighting.directional.position}
					intensity={config.lighting.directional.intensity}
				/>

				<OrbitControls />

				<ChessBoardFlatMeshes />

				{chunkIds.map((chunkId) => (
					<ChunkIdContext key={chunkId} value={chunkId}>
						<ChunkRenderer />
					</ChunkIdContext>
				))}
			</Canvas>
		</ClientOnly>
	);
};
