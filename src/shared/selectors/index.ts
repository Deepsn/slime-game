import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/slices";
import { PlayerData } from "shared/slices/players";

export const selectPlayerBalance = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

export const selectPlayerWorlds = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.worlds[playerId];
	};
};

export const selectPlayerStats = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.stats[playerId];
	};
};

export const selectPlayerSlime = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.slime[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalance(playerId),
		selectPlayerWorlds(playerId),
		selectPlayerStats(playerId),
		selectPlayerSlime(playerId),
		(balance, worlds, stats, slime): PlayerData | undefined => {
			if (!balance || !worlds || !stats || !slime) {
				return;
			}

			return { balance, worlds, stats, slime };
		},
	);
};
