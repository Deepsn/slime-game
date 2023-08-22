import { PlayerData } from "./types";

export const defaultPlayerData: PlayerData = {
	stats: {
		level: 1,
		experience: 0,
		maxExperience: 100,
		points: 0,
		kills: 0,
	},
	worlds: {
		unlocked: [],
		selected: "Area1",
	},
	balance: {
		coins: 0,
	},
	slime: {
		size: 1,
	},
};
