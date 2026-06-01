import type { Vec3 } from "#/routes/match/$matchId/-game/utils/createUtils.ts";

/**********************************************************************************************************
 *   CONSTS
 **********************************************************************************************************/
/** World units per second — higher values reach the destination faster. */
const PIECE_MOVE_SPEED = 12;
const POSITION_SNAP_EPSILON = 1e-4;

/**********************************************************************************************************
 *   FUNCTIONS
 **********************************************************************************************************/
/**
 * Advances `current` toward `target` with frame-rate-independent exponential easing.
 */
export function stepPieceWorldPosition(
	current: Vec3,
	target: Vec3,
	deltaSeconds: number,
): Vec3 {
	const dx = target[0] - current[0];
	const dy = target[1] - current[1];
	const dz = target[2] - current[2];
	const distanceSq = dx * dx + dy * dy + dz * dz;

	if (distanceSq < POSITION_SNAP_EPSILON * POSITION_SNAP_EPSILON) {
		return target;
	}

	const t = 1 - Math.exp(-PIECE_MOVE_SPEED * deltaSeconds);

	return [current[0] + dx * t, current[1] + dy * t, current[2] + dz * t];
}
