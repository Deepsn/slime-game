import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerStats } from "./types";

export interface StatsState {
	readonly [player: number]: PlayerStats | undefined;
}

const initialState: StatsState = {};

export const statsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: number, data: PlayerData) => ({
		...state,
		[player]: data.stats,
	}),

	closePlayerData: (state, player: number) => ({
		...state,
		[player]: undefined,
	}),

	changeStats: (state, player: number, statType: keyof PlayerStats, newStat: number) => {
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
