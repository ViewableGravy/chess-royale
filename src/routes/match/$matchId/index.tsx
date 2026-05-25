import { createFileRoute } from "@tanstack/react-router";
import { batch } from "@tanstack/react-store";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { GameFiberNode } from "./-game";

function randomHexColor() {
	return `#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padStart(6, "0")}`;
}

/***** ROUTE START *****/
export const Route = createFileRoute("/match/$matchId/")({
	component: RouteComponent,
});

/***** COMPONENT START *****/
function RouteComponent() {
	const handleOnClick = () => {
		batch(() => {
			for (let i = 0; i < 10; i++) {
				const rand = (min: number, max: number) =>
					Math.random() * (max - min) + min;
				const x = Math.round(rand(-3, 3) * 10) / 10; // snap to 0.1 grid
				const y = Math.round(rand(-3, 3) * 10) / 10;

				ChunkStore.createData({
					attributes: {
						x,
						y,
						color: randomHexColor(),
					},
				});
			}
		});
	};

	return (
		<div>
			<button type="button" onClick={handleOnClick}>
				more!
			</button>
			<GameFiberNode />
		</div>
	);
}
