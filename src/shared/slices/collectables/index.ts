import { combineProducers } from "@rbxts/reflex";
import { crystalsSlice } from "./crystals";
import { coinsSlice } from "./coins";

export * from "./crystals";
export * from "./coins";
export * from "./types";

export const collectablesSlice = combineProducers({
	crystals: crystalsSlice,
	coins: coinsSlice,
});
