import { CombineStates } from "@rbxts/reflex";
import { playersSlice } from "./players";
import { collectablesSlice } from "./collectables";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	players: playersSlice,
	collectables: collectablesSlice,
};
