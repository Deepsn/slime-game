export interface PlayerData {
	readonly balance: PlayerBalance;
	readonly slime: PlayerSlime;
	readonly stats: PlayerStats;
	readonly worlds: PlayerWorlds;
	readonly upgrades: PlayerUpgrades;
	readonly boosts: PlayerBoosts;
	readonly receipts: PlayerReceipts;
	lastOnline: PlayerLastOnline;
}

export interface PlayerBalance {
	coins: number;
}

export interface PlayerSlime {
	size: number;
	speed: number;
}

export interface PlayerStats {
	level: number;
	experience: number;
	maxExperience: number;
	kills: number;
	forcefield: boolean;
}

export interface PlayerWorlds {
	unlocked: string[];
	selected: `Area${number}` | undefined;
}

export interface PlayerUpgrades {
	speed: number;
	magnet: number;
	xpBoost: number;
	coinBoost: number;
	booster: number;
}

export interface PlayerBoost {
	endTick: number; // tick to end
	timeLeft: number; // time in milliseconds to end
	receiptId: string;
}

export interface PlayerBoosts {
	magnet2x?: PlayerBoost;
	coins2x?: PlayerBoost;
	xp2x?: PlayerBoost;
}

export type PlayerReceipts = string[];

export type PlayerLastOnline = number;
