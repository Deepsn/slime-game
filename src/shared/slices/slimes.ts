import { createProducer } from "@rbxts/reflex";

export interface Slime {
	id: string;
	size: number;
	instance: Model;
}

export interface SlimesState {
	slimes: Slime[];
}

const initialState: SlimesState = {
	slimes: [],
};

export const slimesSlice = createProducer(initialState, {
	addSlime: (state, slime: Slime) => ({
		...state,
		slimes: [...state.slimes, slime],
	}),
	setSize: (state, id: string, size: number) => ({
		...state,
		slimes: state.slimes.map((slime) => {
			if (slime.id === id) {
				slime.size = size;
			}
			return slime;
		}),
	}),
});
