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
	readonly level: number;
	readonly experience: number;
}

export interface PlayerWorlds {
	readonly unlocked: string[];
	readonly selected: string;
}
