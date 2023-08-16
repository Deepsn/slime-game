import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { worldsSlice } from "./worlds";

export * from "./balance";
export * from "./worlds";
export * from "./types";
export * from "./utils";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	worlds: worldsSlice,
});
