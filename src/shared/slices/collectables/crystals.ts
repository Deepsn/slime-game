import { createProducer } from "@rbxts/reflex";
import { Crystal } from "./types";

export interface CrystalsState {
	readonly [areaId: `Area${number}`]:
		| {
				readonly [crystalId: string]: Crystal | undefined;
		  }
		| undefined;
}

const initialState: CrystalsState = {};

export const crystalsSlice = createProducer(initialState, {
	addCrystal: (state, areaId: `Area${number}`, crystal: Crystal) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[crystal.id]: { ...crystal, type: "Crystal" },
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
