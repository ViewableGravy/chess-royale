import { useThree } from "@react-three/fiber";
import type { OrthographicCamera, PerspectiveCamera } from "three";
import invariant from "tiny-invariant";

const isOrthographicCamera = (
	camera: OrthographicCamera | PerspectiveCamera,
): camera is OrthographicCamera => camera.type === "OrthographicCamera";

/**
 * Default camera for the match game `<Canvas orthographic />`.
 * Typed as `OrthographicCamera` — validated once per hook call, not in frame callbacks.
 */
export const useGameCamera = (): OrthographicCamera => {
	const camera = useThree((state) => state.camera);

	if (!isOrthographicCamera(camera)) {
		invariant(false, "Game Canvas must be created with the orthographic prop.");
	}

	return camera;
};
