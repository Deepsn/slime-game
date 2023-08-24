import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerUpgrades } from "./types";

export interface UpgradesState {
	readonly [player: string]: PlayerUpgrades | undefined;
}

const initialState: UpgradesState = {};

export const upgradesSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.upgrades,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeUpgrade: (state, player: string, balanceType: keyof PlayerUpgrades, amount: number) => {
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
