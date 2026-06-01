/**********************************************************************************************************
 *   CONSTS
 **********************************************************************************************************/
/** Radians per second — higher values reach the target view faster. */
const BOARD_VIEW_YAW_SPEED = 10;
const YAW_SNAP_EPSILON = 1e-4;

/**********************************************************************************************************
 *   FUNCTIONS
 **********************************************************************************************************/
/**
 * Advances `current` toward `target` along the shortest arc, with frame-rate-independent easing.
 */
export function stepBoardViewYaw(current: number, target: number, deltaSeconds: number): number {
	const shortestDelta = Math.atan2(Math.sin(target - current), Math.cos(target - current));

	if (Math.abs(shortestDelta) < YAW_SNAP_EPSILON) {
		return target;
	}

	const t = 1 - Math.exp(-BOARD_VIEW_YAW_SPEED * deltaSeconds);

	return current + shortestDelta * t;
}
