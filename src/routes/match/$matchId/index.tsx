import { loadGameConfig } from "#/assets/config/loadGameConfig.ts";
import { GameConfigContext } from "#/routes/match/$matchId/-game/context/GameConfigContext.tsx";
import { ChunkStore } from "#/routes/match/$matchId/-game/store/store.ts";
import { TEAM_IDS, type TeamName } from "#/routes/match/$matchId/-game/store/consts";
import { createTeamId } from "#/routes/match/$matchId/-game/store/createTeamId";
import { getTeamColor } from "#/routes/match/$matchId/-game/store/teams/getTeamColor.ts";
import { TURN_ORDER } from "#/routes/match/$matchId/-game/store/turnOrder.ts";
import { attachSelectionEscapeListener } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/attachSelectionEscapeListener.ts";
import { canLocalPlayerAct } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/canLocalPlayerAct.ts";
import { WorldStateStore } from "#/routes/match/$matchId/-game/store/worldState/store.ts";
import { createUtils } from "#/routes/match/$matchId/-game/utils/createUtils.ts";
import { createFileRoute } from "@tanstack/react-router";
import { batch, useSelector } from "@tanstack/react-store";
import { GameFiberNode } from "./-game";
import "./MatchControls.css";
import { getRandomPieceLetter } from "./-game/store/piece/getRandomPieceLetter";

const matchShellRef = (node: HTMLDivElement | null) => {
	if (!node) {
		return;
	}

	return attachSelectionEscapeListener();
};

const handleTick = () => {
	WorldStateStore.actions.tick();
};

const handlePassTurn = () => {
	WorldStateStore.actions.passTurn();
};

const handlePlayAsChange = (teamName: TeamName) => {
	WorldStateStore.setState((prev) => ({
		...prev,
		localPlayerTeamId: createTeamId(teamName),
		selectedPiece: null,
	}));
};

/***** ROUTE START *****/
export const Route = createFileRoute("/match/$matchId/")({
	component: RouteComponent,
});

/***** COMPONENT START *****/
function RouteComponent() {
	const config = loadGameConfig();
	const utils = createUtils(config);
	const tick = useSelector(WorldStateStore, (state) => state.tick);
	const activeTeamId = useSelector(WorldStateStore, (state) => state.activeTeamId);
	const localPlayerTeamId = useSelector(WorldStateStore, (state) => state.localPlayerTeamId);
	const canAct = useSelector(WorldStateStore, (state) => canLocalPlayerAct(state));

	const handleOnClick = () => {
		batch(() => {
			for (let i = 0; i < 10; i++) {
				const teamId = createTeamId(TEAM_IDS[Math.floor(Math.random() * TEAM_IDS.length)]);

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

	const activeTeamName = activeTeamId as TeamName;
	const activeTeamColor = getTeamColor(activeTeamId);

	return (
		<GameConfigContext value={{ config, utils }}>
			<div ref={matchShellRef} className="match-shell">
				<div
					className="match-turn-indicator"
					title={`${activeTeamName} is playing`}
					aria-label={`${activeTeamName} is playing`}
				>
					<span
						className="match-turn-indicator__swatch"
						style={{ backgroundColor: activeTeamColor }}
					/>
					<span className="match-turn-indicator__label">{activeTeamName}</span>
				</div>

				<div className="match-controls">
					{!canAct ? (
						<button type="button" className="match-controls__button" onClick={handlePassTurn}>
							Next player
						</button>
					) : null}
					<button
						type="button"
						className="match-controls__button match-controls__button--primary"
						onClick={handleTick}
					>
						Tick ({tick})
					</button>
					<button type="button" className="match-controls__button" onClick={handleOnClick}>
						more!
					</button>
				</div>

				<div className="match-play-as">
					<span className="match-play-as__label">Play as</span>
					{TURN_ORDER.map((teamName) => {
						const teamId = createTeamId(teamName);
						const isSelected = localPlayerTeamId === teamId;

						return (
							<button
								key={teamName}
								type="button"
								className="match-play-as__team"
								data-selected={isSelected ? "" : undefined}
								title={teamName}
								aria-label={`Play as ${teamName}`}
								aria-pressed={isSelected}
								onClick={() => {
									handlePlayAsChange(teamName);
								}}
							>
								<span
									className="match-play-as__swatch"
									style={{ backgroundColor: getTeamColor(teamId) }}
								/>
							</button>
						);
					})}
				</div>

				<GameFiberNode />
			</div>
		</GameConfigContext>
	);
}
