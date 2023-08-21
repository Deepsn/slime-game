import { createProducer } from "@rbxts/reflex";
import { Collectable } from "./types";

export interface CrystalsState {
	readonly [areaId: string]:
		| {
				readonly [crystalId: string]: Collectable | undefined;
		  }
		| undefined;
}

const initialState: CrystalsState = {};

export const crystalsSlice = createProducer(initialState, {
	addCrystal: (state, areaId: `Area${number}`, crystal: Collectable) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[crystal.id]: crystal,
		},
	}),

	removeCrystal: (state, areaId: `Area${number}`, crystalId: string) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[crystalId]: undefined,
		},
	}),
});