import { PlayerData } from "./types";

export const defaultPlayerData: PlayerData = {
	stats: {
		level: 1,
		experience: 0,
	},
	worlds: {
		unlocked: [],
		selected: "",
	},
	balance: {
		coins: 0,
	},
	slime: {
		size: 1,
	},
};
