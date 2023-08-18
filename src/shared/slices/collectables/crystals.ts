import { createProducer } from "@rbxts/reflex";
import { Crystal } from "./types";

export interface CrystalsState {
	readonly [crystalId: string]: Crystal | undefined;
}

const initialState: CrystalsState = {};

export const crystalsSlice = createProducer(initialState, {
	addCrystal: (state, crystal: Crystal) => ({
		...state,
		[crystal.id]: crystal,
	}),

	removeCrystal: (state, crystalId: string) => ({
		...state,
		[crystalId]: undefined,
	}),
});
