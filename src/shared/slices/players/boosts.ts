import { createProducer } from "@rbxts/reflex";
import { PlayerBoost, PlayerBoosts, PlayerData } from "./types";

export interface BoostsState {
	readonly [player: string]: PlayerBoosts | undefined;
}

const initialState: BoostsState = {};

export const boostsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.boosts,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	setBoost: (state, player: string, boostName: keyof PlayerBoosts, boost: PlayerBoost) => {
		const boosts = state[player];

		return {
			...state,
			[player]:
				boosts !== undefined
					? {
							...boosts,
							[boostName]: boost,
					  }
					: undefined,
		};
	},

	removeBoost: (state, player: string, boostName: keyof PlayerBoosts) => {
		const boosts = state[player];

		return {
			...state,
			[player]:
				boosts !== undefined
					? {
							...boosts,
							[boostName]: undefined,
					  }
					: undefined,
		};
	},
});
