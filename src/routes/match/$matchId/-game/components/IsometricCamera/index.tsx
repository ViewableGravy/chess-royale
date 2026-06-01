import { useFrameAnimation } from "#/hooks/useFrameAnimation/index.ts";
import { useInvariantContext } from "#/hooks/useInvariantContext/index.ts";
import { getBoardViewYaw } from "#/routes/match/$matchId/-game/boardView/getBoardViewYaw.ts";
import { getIsometricCameraPosition } from "#/routes/match/$matchId/-game/boardView/getIsometricCameraPosition.ts";
import { getIsometricFrustumHalfExtent } from "#/routes/match/$matchId/-game/boardView/getIsometricFrustumHalfExtent.ts";
import { stepBoardViewYaw } from "#/routes/match/$matchId/-game/boardView/stepBoardViewYaw.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { useGameCamera } from "#/routes/match/$matchId/-game/hooks/useGameCamera.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { useThree } from "@react-three/fiber";
import { useSelector } from "@tanstack/react-store";

/**
 * Configures the Canvas orthographic camera (world-space frustum + isometric angle).
 * We update the default camera imperatively because R3F resets non-manual frustums on
 * resize, and a declarative <orthographicCamera> conflicts with TanStack devtools
 * injecting DOM attributes onto Three.js objects.
 *
 * Board view yaw eases toward the local team's orientation when "Play as" changes.
 * Frustum and yaw are reapplied every frame (including after resize) via useFrameAnimation.
 */
export const IsometricCamera = () => {
	const { config } = useInvariantContext(GameConfigContext);
	const camera = useGameCamera();
	const size = useThree((state) => state.size);
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);
	const aspect = size.width / size.height || 1;

	const applyBoardViewYaw = (boardViewYaw: number) => {
		camera.manual = true;

		const frustumHalfExtent = getIsometricFrustumHalfExtent(config);
		const [x, y, z] = getIsometricCameraPosition(boardViewYaw, config.camera.distance);

		camera.left = -frustumHalfExtent * aspect;
		camera.right = frustumHalfExtent * aspect;
		camera.top = frustumHalfExtent;
		camera.bottom = -frustumHalfExtent;
		camera.near = config.camera.near;
		camera.far = config.camera.far;
		camera.position.set(x, y, z);
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	};

	useFrameAnimation({
		initial: () => getBoardViewYaw(localPlayerTeamId),
		getTarget: () => getBoardViewYaw(localPlayerTeamId),
		step: stepBoardViewYaw,
		apply: applyBoardViewYaw,
	});

	return null;
};
