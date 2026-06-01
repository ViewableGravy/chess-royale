import type { TeamId } from "#/routes/match/$matchId/-game/store/consts.ts";
import { getBoardViewYaw } from "#/routes/match/$matchId/-game/boardView/getBoardViewYaw.ts";

/** Equal X/Z offset at fixed elevation — classic isometric on an XZ floor (Y-up). */
export function getIsometricCameraPosition(
	teamId: TeamId,
	distance: number,
): [number, number, number] {
	const yaw = getBoardViewYaw(teamId);
	const baseX = distance;
	const baseZ = distance;
	const x = baseX * Math.cos(yaw) - baseZ * Math.sin(yaw);
	const z = baseX * Math.sin(yaw) + baseZ * Math.cos(yaw);

	return [x, distance, z];
}
