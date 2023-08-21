import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerSlime } from "./types";

export interface SlimeState {
	readonly [player: number]: PlayerSlime | undefined;
}

const initialState: SlimeState = {};

export const slimeSlice = createProducer(initialState, {
	loadPlayerData: (state, player: number, data: PlayerData) => ({
		...state,
		[player]: data.slime,
	}),

	closePlayerData: (state, player: number) => ({
		...state,
		[player]: undefined,
	}),

	changeSlimeStat: (state, player: number, statType: keyof PlayerSlime, newStat: number) => {
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
});
