import { clearSelectedPiece } from "#/routes/match/$matchId/-game/store/worldState/gameInteraction/tryMoveSelectedPiece.ts";

function handleSelectionEscapeKeyDown(event: KeyboardEvent) {
	if (event.key !== "Escape") {
		return;
	}

	clearSelectedPiece();
}

export function attachSelectionEscapeListener(): (() => void) | undefined {
	if (typeof window === "undefined") {
		return undefined;
	}

	window.addEventListener("keydown", handleSelectionEscapeKeyDown);

	return () => {
		window.removeEventListener("keydown", handleSelectionEscapeKeyDown);
	};
}
