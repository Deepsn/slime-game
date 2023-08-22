import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerSlime } from "./types";

export interface SlimeState {
	readonly [player: string]: PlayerSlime | undefined;
}

const initialState: SlimeState = {};

export const slimeSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.slime,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeSlimeStat: (state, player: string, statType: keyof PlayerSlime, newStat: number) => {
		const slimeStats = state[player];

		return {
			...state,
			[player]:
				slimeStats !== undefined
					? {
							...slimeStats,
							[statType]: slimeStats[statType] + newStat,
					  }
					: undefined,
		};
	},

	setSlimeStat: (state, player: string, statType: keyof PlayerSlime, newStat: number) => {
		const slimeStats = state[player];

		return {
			...state,
			[player]:
				slimeStats !== undefined
					? {
							...slimeStats,
							[statType]: newStat,
					  }
					: undefined,
		};
	},
});
