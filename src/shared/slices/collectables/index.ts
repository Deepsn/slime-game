import { combineProducers } from "@rbxts/reflex";
import { crystalsSlice } from "./crystals";

export * from "./crystals";
export * from "./coins";
export * from "./types";

export const collectablesSlice = combineProducers({
	crystals: crystalsSlice,
});
