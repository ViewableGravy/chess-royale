import { createFileRoute } from "@tanstack/react-router";
import { batch } from "@tanstack/react-store";
import { loadGameConfig } from "#/assets/config/loadGameConfig.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { PIECE_LETTERS } from "#/routes/match/$matchId/-game/store/consts.ts";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { createUtils } from "#/routes/match/$matchId/-game/utils/createUtils.ts";
import { GameFiberNode } from "./-game";

/***** ROUTE START *****/
export const Route = createFileRoute("/match/$matchId/")({
	component: RouteComponent,
});

/***** COMPONENT START *****/
function RouteComponent() {
	const config = loadGameConfig();
	const utils = createUtils(config);

	const handleOnClick = () => {
		batch(() => {
			for (let i = 0; i < 10; i++) {
				ChunkStore.createData({
					attributes: {
						x: Math.floor(Math.random() * config.board.size),
						y: Math.floor(Math.random() * config.board.size),
						color: `#${Math.floor(Math.random() * 0xffffff)
							.toString(16)
							.padStart(6, "0")}`,
						piece:
							PIECE_LETTERS[Math.floor(Math.random() * PIECE_LETTERS.length)],
					},
				});
			}
		});
	};

	return (
		<GameConfigContext value={{ config, utils }}>
			<div>
				<button type="button" onClick={handleOnClick}>
					more!
				</button>
				<GameFiberNode />
			</div>
		</GameConfigContext>
	);
}
