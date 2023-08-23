import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerStats } from "./types";
import { t } from "@rbxts/t";

export interface StatsState {
	readonly [player: string]: PlayerStats | undefined;
}

const initialState: StatsState = {};

export const statsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.stats,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeStats: (state, player: string, statType: KeyOfType<PlayerStats, number>, newStat: number) => {
		const stats = state[player];

		return {
			...state,
			[player]:
				stats !== undefined
					? {
							...stats,
							[statType]: stats[statType] + newStat,
					  }
					: undefined,
		};
	},

	setStats: (state, player: string, statType: keyof PlayerStats, newStat: ValueOf<PlayerStats>) => {
		const stats = state[player];

		return {
			...state,
			[player]:
				stats !== undefined
					? {
							...stats,
							[statType]: newStat,
					  }
					: undefined,
		};
	},
});
