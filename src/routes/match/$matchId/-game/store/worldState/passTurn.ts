import { advanceActiveTeam } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/advanceActiveTeam.ts";

export function passTurn(): void {
	advanceActiveTeam();
}
