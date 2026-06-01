import { clearSelectedPiece } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/tryMoveSelectedPiece.ts";

export function attachSelectionEscapeListener(): (() => void) | undefined {
	if (typeof window === "undefined") {
		return undefined;
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		clearSelectedPiece();
	};

	window.addEventListener("keydown", handleKeyDown);

	return () => {
		window.removeEventListener("keydown", handleKeyDown);
	};
}
