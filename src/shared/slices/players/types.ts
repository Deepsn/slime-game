export interface PlayerData {
	readonly balance: PlayerBalance;
	readonly slime: PlayerSlime;
	readonly stats: PlayerStats;
	readonly worlds: PlayerWorlds;
	readonly upgrades: PlayerUpgrades;
	readonly boosts: PlayerBoosts;
}

export interface PlayerBalance {
	coins: number;
}

export interface PlayerSlime {
	size: number;
	speed: number;
	magnet: number;
}

export interface PlayerStats {
	level: number;
	experience: number;
	maxExperience: number;
	kills: number;
	forcefield: boolean;
}

export interface PlayerWorlds {
	readonly unlocked: string[];
	selected: `Area${number}` | undefined;
}

export interface PlayerUpgrades {
	speed: number;
	magnet: number;
	xpBoost: number;
	coinBoost: number;
	booster: number;
}

export interface PlayerBoosts {
	magnet2x?: number;
	coins2x?: number;
	xp2x?: number;
}
