import { CombineStates } from "@rbxts/reflex";
import { slimesSlice } from "./slimes";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	slimes: slimesSlice,
};
