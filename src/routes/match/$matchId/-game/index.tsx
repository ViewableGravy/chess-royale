import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MOUSE } from "three";
import { ClientOnly } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { useState } from "react";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { ChunkIdContext } from "#/routes/match/$matchId/-game/store/context.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { ChessBoardFlatMeshes } from "./components/ChessBoard/index.tsx";
import { IsometricCamera } from "./components/IsometricCamera/index.tsx";
import { ChunkRenderer } from "./components/ChunkRenderer";
import "./GameFiberNode.css";

type CanvasSize = {
	width: number;
	height: number;
};

function getViewportCanvasSize(): CanvasSize {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

/***** COMPONENT START *****/
export const GameFiberNode = () => {
	const { config } = useInvariantContext(GameConfigContext);
	const chunkIds = useSelector(ChunkStore, (state) => Array.from(state.keys()));
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);
	const [canvasSize, setCanvasSize] = useState<CanvasSize>(() =>
		typeof window === "undefined" ? { width: 0, height: 0 } : getViewportCanvasSize(),
	);

	const gameCanvasContainerRef = (node: HTMLDivElement | null) => {
		if (!node) {
			return;
		}

		const updateCanvasSize = () => {
			setCanvasSize({
				width: node.clientWidth,
				height: node.clientHeight,
			});
		};

		updateCanvasSize();

		const resizeObserver = new ResizeObserver(updateCanvasSize);
		resizeObserver.observe(node);

		return () => {
			resizeObserver.disconnect();
		};
	};

	return (
		<ClientOnly>
			<div ref={gameCanvasContainerRef} className="game-fiber-canvas">
				<Canvas
					dpr={[1, 1.5]}
					id="game-canvas"
					orthographic
					style={{
						width: canvasSize.width,
						height: canvasSize.height,
					}}
				>
					<IsometricCamera />
					<color attach="background" args={[config.canvas.background]} />
					<ambientLight intensity={config.lighting.ambient.intensity} />
					<directionalLight
						position={config.lighting.directional.position}
						intensity={config.lighting.directional.intensity}
					/>

					<OrbitControls
						key={localPlayerTeamId}
						enableRotate={false}
						enablePan
						enableZoom
						target={[0, 0, 0]}
						mouseButtons={{
							LEFT: MOUSE.PAN,
							MIDDLE: MOUSE.DOLLY,
							RIGHT: MOUSE.PAN,
						}}
					/>

					<ChessBoardFlatMeshes />

					{chunkIds.map((chunkId) => (
						<ChunkIdContext key={chunkId} value={chunkId}>
							<ChunkRenderer />
						</ChunkIdContext>
					))}
				</Canvas>
			</div>
		</ClientOnly>
	);
};
