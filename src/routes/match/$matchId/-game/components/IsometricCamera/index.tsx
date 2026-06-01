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
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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
	const controls = useThree((state) => state.controls as OrbitControlsImpl | undefined);
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);
	const aspect = size.width / size.height || 1;

	const applyBoardViewYaw = (boardViewYaw: number) => {
		camera.manual = true;

		const frustumHalfExtent = getIsometricFrustumHalfExtent(config);
		const [baseX, baseY, baseZ] = getIsometricCameraPosition(
			boardViewYaw,
			config.camera.distance,
		);
		const target = controls?.target;

		camera.left = -frustumHalfExtent * aspect;
		camera.right = frustumHalfExtent * aspect;
		camera.top = frustumHalfExtent;
		camera.bottom = -frustumHalfExtent;
		camera.near = config.camera.near;
		camera.far = config.camera.far;

		if (target) {
			camera.position.set(baseX + target.x, baseY + target.y, baseZ + target.z);
			camera.lookAt(target);
		} else {
			camera.position.set(baseX, baseY, baseZ);
			camera.lookAt(0, 0, 0);
		}

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
