import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { ChunkIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { ChessBoardFlatMeshes } from "./components/ChessBoard/index.tsx";
import { ChunkRenderer } from "./components/ChunkRenderer";

/***** COMPONENT START *****/
export const GameFiberNode = () => {
	const chunkIds = useSelector(ChunkStore, (state) => Array.from(state.keys()));

	return (
		<ClientOnly>
			<Canvas
				id="game-canvas"
				style={{ height: "800px" }}
				camera={{ position: [0, 0, 14], fov: 50 }}
			>
				<color attach="background" args={["#0f172a"]} />
				<ambientLight intensity={0.7} />
				<directionalLight position={[3, 5, 2]} intensity={1.2} />

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
