import { createProducer } from "@rbxts/reflex";
import { PlayerBoosts, PlayerData } from "./types";

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

	addBoost: (state, player: string, boostType: keyof PlayerBoosts, boostExpiration: number) => {
		const boosts = state[player];

		return {
			...state,
			[player]:
				boosts !== undefined
					? {
							...boosts,
							[boostType]: boostExpiration,
					  }
					: undefined,
		};
	},
});
