export interface PlayerData {
	readonly balance: PlayerBalance;
	readonly slime: PlayerSlime;
	readonly stats: PlayerStats;
	readonly worlds: PlayerWorlds;
}

export interface PlayerBalance {
	coins: number;
}

export interface PlayerSlime {
	size: number;
}

export interface PlayerStats {
	level: number;
	experience: number;
	points: number;
}

export interface PlayerWorlds {
	readonly unlocked: string[];
	selected: `Area${number}`;
}
