import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { worldsSlice } from "./worlds";
import { statsSlice } from "./stats";
import { slimeSlice } from "./slime";

export * from "./balance";
export * from "./worlds";
export * from "./stats";
export * from "./slime";
export * from "./types";
export * from "./utils";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	worlds: worldsSlice,
	stats: statsSlice,
	slime: slimeSlice,
});
