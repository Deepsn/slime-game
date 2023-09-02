import { PlayerData } from "./types";

export const defaultPlayerData: PlayerData = {
	receipts: [],
	stats: {
		level: 1,
		experience: 0,
		maxExperience: 400,
		kills: 0,
		forcefield: false,
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
		speed: 1,
	},
	upgrades: {
		speed: 1,
		magnet: 1,
		xpBoost: 1,
		coinBoost: 1,
		booster: 1,
	},
	boosts: {},
	lastOnline: 0,
};
