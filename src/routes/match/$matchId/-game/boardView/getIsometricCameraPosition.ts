
/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
type Vec3Tuple = [number, number, number];

/** Equal X/Z offset at fixed elevation — classic isometric on an XZ floor (Y-up). */
export function getIsometricCameraPosition(boardViewYaw: number, distance: number): Vec3Tuple {
	const baseX = distance;
	const baseZ = distance;
	const x = baseX * Math.cos(boardViewYaw) - baseZ * Math.sin(boardViewYaw);
	const z = baseX * Math.sin(boardViewYaw) + baseZ * Math.cos(boardViewYaw);

	return [x, distance, z];
}
