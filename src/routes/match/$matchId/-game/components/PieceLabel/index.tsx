import type React from "react";
import { CanvasTexture, type MeshBasicMaterial } from "three";
import invariant from "tiny-invariant";

type PieceLabel = React.FC<{
	letter: string;
	size: number;
	pieceSize: number;
}>;

export const PieceLabel: PieceLabel = ({ letter, size, pieceSize }) => {
	const resolution = 128;
	const canvas = document.createElement("canvas");
	canvas.width = resolution;
	canvas.height = resolution;

	const context = canvas.getContext("2d");
	invariant(context, "Failed to create 2d canvas context for piece label");

	context.clearRect(0, 0, resolution, resolution);
	context.font = `bold ${resolution * 0.55}px system-ui, sans-serif`;
	context.textAlign = "center";
	context.textBaseline = "middle";

	const center = resolution / 2;
	context.lineJoin = "round";
	context.lineWidth = resolution * 0.1;
	context.strokeStyle = "#0f172a";
	context.strokeText(letter, center, center);
	context.fillStyle = "#ffffff";
	context.fillText(letter, center, center);

	const texture = new CanvasTexture(canvas);
	texture.needsUpdate = true;

	return (
		<mesh position={[0, 0, pieceSize / 2 + 0.01]} raycast={() => null}>
			<planeGeometry args={[size, size]} />
			<meshBasicMaterial
				depthWrite={false}
				map={texture}
				ref={(material: MeshBasicMaterial) => {

					return () => {
						material.map?.dispose();
					};
				}}
				toneMapped={false}
				transparent
			/>
		</mesh>
	);
};
