import { loadGameConfig } from "#/assets/config/loadGameConfig.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { createUtils } from "#/routes/match/$matchId/-game/utils/createUtils.ts";
import { createFileRoute } from "@tanstack/react-router";
import { batch, useSelector } from "@tanstack/react-store";
import { GameFiberNode } from "./-game";
import { TEAM_IDS } from "./-game/store/consts";
import { createTeamId } from "./-game/store/createTeamId";
import { getRandomPieceLetter } from "./-game/store/piece/getRandomPieceLetter";

/***** ROUTE START *****/
export const Route = createFileRoute("/match/$matchId/")({
	component: RouteComponent,
});

/***** COMPONENT START *****/
function RouteComponent() {
	const config = loadGameConfig();
	const utils = createUtils(config);
	const tick = useSelector(WorldStateStore, (state) => state.tick);

	const handleTick = () => {
		WorldStateStore.actions.tick();
	};

	const handleOnClick = () => {
		batch(() => {
			for (let i = 0; i < 10; i++) {
				const teamId = createTeamId(
					TEAM_IDS[Math.floor(Math.random() * TEAM_IDS.length)],
				);

				ChunkStore.actions.createData({
					attributes: {
						x: Math.floor(Math.random() * config.board.size),
						y: Math.floor(Math.random() * config.board.size),
						teamId,
						piece: getRandomPieceLetter(),
					},
				});
			}
		});
	};

	return (
		<GameConfigContext value={{ config, utils }}>
			<div>
				<button type="button" onClick={handleTick}>
					Tick ({tick})
				</button>
				<button type="button" onClick={handleOnClick}>
					more!
				</button>
				<GameFiberNode />
			</div>
		</GameConfigContext>
	);
}
