import type { GameConfig } from "#/assets/config/loadGameConfig.ts";
import type { TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { getIsometricCameraPosition } from "#/routes/match/$matchId/-game/boardView/getIsometricCameraPosition.ts";
import { getIsometricFrustumHalfExtent } from "#/routes/match/$matchId/-game/boardView/getIsometricFrustumHalfExtent.ts";
import type { OrthographicCamera } from "three";

type ApplyIsometricCameraOptions = {
	camera: OrthographicCamera;
	config: GameConfig;
	localPlayerTeamId: TeamId;
	aspect: number;
};

export function applyIsometricCamera({
	camera,
	config,
	localPlayerTeamId,
	aspect,
}: ApplyIsometricCameraOptions): void {
	camera.manual = true;

	const frustumHalfExtent = getIsometricFrustumHalfExtent(config);
	const [x, y, z] = getIsometricCameraPosition(localPlayerTeamId, config.camera.distance);

	camera.left = -frustumHalfExtent * aspect;
	camera.right = frustumHalfExtent * aspect;
	camera.top = frustumHalfExtent;
	camera.bottom = -frustumHalfExtent;
	camera.near = config.camera.near;
	camera.far = config.camera.far;
	camera.position.set(x, y, z);
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
}
