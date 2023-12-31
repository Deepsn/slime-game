import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/slices";
import { PlayerBoosts, PlayerData, PlayerUpgrades } from "shared/slices/players";

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

export const selectPlayerUpgrades = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.upgrades[playerId];
	};
};

export const selectPlayerBoosts = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.boosts[playerId];
	};
};

export const selectPlayerReceipts = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.receipts[playerId];
	};
};

export const selectPlayerLastOnline = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.lastOnline[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalance(playerId),
		selectPlayerWorlds(playerId),
		selectPlayerStats(playerId),
		selectPlayerSlime(playerId),
		selectPlayerUpgrades(playerId),
		selectPlayerBoosts(playerId),
		selectPlayerReceipts(playerId),
		selectPlayerLastOnline(playerId),
		(balance, worlds, stats, slime, upgrades, boosts, receipts, lastOnline): PlayerData | undefined => {
			if (!balance || !worlds || !stats || !slime || !upgrades || !boosts || !receipts || !lastOnline) {
				return;
			}

			return { balance, worlds, stats, slime, upgrades, boosts, receipts, lastOnline };
		},
	);
};

export const selectPlayerCurrentWorld = (playerId: string) => {
	return createSelector(selectPlayerWorlds(playerId), (worlds) => {
		return worlds?.selected;
	});
};

export const selectPlayerBoost = (playerId: string, boostName: keyof PlayerBoosts) => {
	return createSelector(selectPlayerBoosts(playerId), (boosts) => {
		return boosts?.[boostName];
	});
};

export const selectPlayerUpgrade = (playerId: string, upgradeName: keyof PlayerUpgrades) => {
	return createSelector(selectPlayerUpgrades(playerId), (upgrades) => {
		return upgrades?.[upgradeName];
	});
};
