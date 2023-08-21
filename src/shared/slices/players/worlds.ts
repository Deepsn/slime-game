import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerWorlds } from "./types";

export interface WorldsState {
	readonly [player: number]: PlayerWorlds | undefined;
}

const initialState: WorldsState = {};

export const worldsSlice = createProducer(initialState, {
	loadPlayerData: (state, player: number, data: PlayerData) => ({
		...state,
		[player]: data.worlds,
	}),

	closePlayerData: (state, player: number) => ({
		...state,
		[player]: undefined,
	}),

	addWorld: (state, player: number, world: string) => {
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

	removeWorld: (state, player: number, worldName: string) => {
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

	setSelectedWorld: (state, player: number, worldName: `Area${number}`) => {
		const worlds = state[player];
		const hasWorld = worlds?.unlocked.includes(worldName);

		return {
			...state,
			[player]:
				worlds !== undefined
					? hasWorld
						? {
								unlocked: worlds.unlocked,
								selected: worldName,
						  }
						: worlds
					: undefined,
		};
	},
});
