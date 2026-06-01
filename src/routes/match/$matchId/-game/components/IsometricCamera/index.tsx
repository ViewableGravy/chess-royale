import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { applyIsometricCamera } from "#/routes/match/$matchId/-game/boardView/applyIsometricCamera.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { useFrame, useThree } from "@react-three/fiber";
import { useSelector } from "@tanstack/react-store";
import { useLayoutEffect } from "react";
import { OrthographicCamera } from "three";

/**
 * Configures the Canvas orthographic camera (world-space frustum + isometric angle).
 * We update the default camera in useLayoutEffect because R3F resets non-manual
 * frustums on resize, and a declarative <orthographicCamera> conflicts with
 * TanStack devtools injecting DOM attributes onto Three.js objects.
 */
export const IsometricCamera = () => {
	const { config } = useInvariantContext(GameConfigContext);
	const camera = useThree((state) => state.camera);
	const size = useThree((state) => state.size);
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);

	useLayoutEffect(() => {
		if (camera instanceof OrthographicCamera) {
			applyIsometricCamera({
				camera,
				config,
				localPlayerTeamId,
				aspect: size.width / size.height || 1,
			});
		}
	}, [camera, config, localPlayerTeamId, size.height, size.width]);

	// Keep manual frustum if R3F resize runs after layout
	useFrame(() => {
		if (camera instanceof OrthographicCamera && camera.manual) {
			applyIsometricCamera({
				camera,
				config,
				localPlayerTeamId,
				aspect: size.width / size.height || 1,
			});
		}
	});

	return null;
};
