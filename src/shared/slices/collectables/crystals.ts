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
			[crystal.id]: { ...crystal, areaId, originalPosition: crystal.position, type: "Crystal" },
		},
	}),

	removeCrystal: (state, areaId: `Area${number}`, crystalId: string) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[crystalId]: undefined,
		},
	}),

	setCrystalPosition: (state, areaId: `Area${number}`, crystalId: string, position: Vector3) => {
		const crystal = state[areaId]?.[crystalId];

		return {
			...state,
			[areaId]: {
				...state[areaId],
				[crystalId]:
					crystal !== undefined
						? {
								...state[areaId]?.[crystalId],
								position,
						  }
						: undefined,
			},
		};
	},
});
