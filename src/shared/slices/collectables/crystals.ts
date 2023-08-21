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
	addCrystal: (state, areaId: string, crystal: Collectable) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[crystal.id]: { ...crystal, type: "Crystal" },
		},
	}),

	removeCrystal: (state, areaId: string, crystalId: string) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[crystalId]: undefined,
		},
	}),
});
