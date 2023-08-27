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

	addUpgrade: (state, player: string, upgrade: keyof PlayerUpgrades) => {
		const upgrades = state[player];

		return {
			...state,
			[player]:
				upgrades !== undefined
					? {
							...upgrades,
							[upgrade]: upgrades[upgrade] + 1,
					  }
					: undefined,
		};
	},

	removeUpgrade: (state, player: string, upgrade: keyof PlayerUpgrades) => {
		const upgrades = state[player];

		return {
			...state,
			[player]:
				upgrades !== undefined
					? {
							...upgrades,
							[upgrade]: upgrades[upgrade] - 1,
					  }
					: undefined,
		};
	},
});
