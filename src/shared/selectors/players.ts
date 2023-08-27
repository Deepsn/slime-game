import { createSelector } from "@rbxts/reflex";
import { selectPlayerWorlds } from ".";

export const selectPlayerCurrentWorld = (playerId: string) => {
	return createSelector(selectPlayerWorlds(playerId), (worlds) => {
		return worlds?.selected;
	});
};
