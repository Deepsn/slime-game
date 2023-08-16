import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerWorlds } from "./types";

export interface WorldsState {
	readonly [player: string]: PlayerWorlds | undefined;
}

const initialState: WorldsState = {};

export const worldsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.worlds,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	addWorld: (state, player: string, world: string) => {
		const worlds = state[player];

		return {
			...state,
			[player]:
				worlds !== undefined
					? {
							unlocked: [...worlds.selected, world],
							selected: worlds.selected,
					  }
					: undefined,
		};
	},

	removeWorld: (state, player: string, worldName: string) => {
		const worlds = state[player];

		return {
			...state,
			[player]:
				worlds !== undefined
					? {
							unlocked: worlds.unlocked.filter((world) => world !== worldName),
							selected: worlds.selected,
					  }
					: undefined,
		};
	},

	setSelectedWorld: (state, player: string, worldName: string) => {
		const worlds = state[player];
		const hasWorld = worlds?.unlocked.includes(worldName);

		return {
			...state,
			[player]:
				worlds !== undefined
					? {
							unlocked: worlds.unlocked,
							selected: hasWorld ? worldName : worlds.selected,
					  }
					: undefined,
		};
	},
});
