import { createProducer } from "@rbxts/reflex";

export interface Slime {
	id: string;
	size: number;
	instance: Model;
}

export interface SlimesState {
	entities: Slime[];
}

const initialState: SlimesState = {
	entities: [],
};

export const slimesSlice = createProducer(initialState, {
	addSlime: (state, slime: Slime) => ({
		...state,
		entities: [...state.entities, slime],
	}),
	setSize: (state, id: string, size: number) => ({
		...state,
		entities: state.entities.map((slime) => {
			if (slime.id === id) {
				slime.size = size;
			}
			return slime;
		}),
	}),
});
