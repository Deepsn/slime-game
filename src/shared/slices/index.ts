import { CombineStates } from "@rbxts/reflex";
import { slimesSlice } from "./slimes";
import { playersSlice } from "./players";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	slimes: slimesSlice,
	players: playersSlice,
};
