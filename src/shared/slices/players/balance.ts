import { createProducer } from "@rbxts/reflex";
import { PlayerBalance, PlayerData } from "./types";

export interface BalanceState {
	readonly [player: number]: PlayerBalance | undefined;
}

const initialState: BalanceState = {};

export const balanceSlice = createProducer(initialState, {
	loadPlayerData: (state, player: number, data: PlayerData) => ({
		...state,
		[player]: data.balance,
	}),

	closePlayerData: (state, player: number) => ({
		...state,
		[player]: undefined,
	}),

	changeBalance: (state, player: number, balanceType: keyof PlayerBalance, amount: number) => {
		const balance = state[player];

		return {
			...state,
			[player]:
				balance !== undefined
					? {
							...balance,
							[balanceType]: balance[balanceType] + amount,
					  }
					: undefined,
		};
	},
});
