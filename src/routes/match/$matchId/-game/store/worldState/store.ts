import { createStore } from "@tanstack/react-store";
import { createInitialWorldState } from "#/routes/match/$matchId/-game/store/worldState/createInitialWorldState.ts";
import { createTick } from "#/routes/match/$matchId/-game/store/worldState/createTick.ts";
import { getNewlyRemovedKeys } from "#/routes/match/$matchId/-game/store/worldState/getNewlyRemovedKeys.ts";
import { passTurn } from "#/routes/match/$matchId/-game/store/worldState/passTurn.ts";
import { removePiecesOnRemovedTiles } from "#/routes/match/$matchId/-game/store/worldState/removePiecesOnRemovedTiles.ts";

export const WorldStateStore = createStore(createInitialWorldState(), (api) => ({
	tick: createTick(api),
	passTurn,
}));

const processedRemovedKeys = new Set(WorldStateStore.get().closingZone.removed);

WorldStateStore.subscribe((state) => {
	const newlyRemoved = getNewlyRemovedKeys(state.closingZone.removed, processedRemovedKeys);

	if (newlyRemoved.length > 0) {
		removePiecesOnRemovedTiles(newlyRemoved);

		for (const key of newlyRemoved) {
			processedRemovedKeys.add(key);
		}
	}
});
