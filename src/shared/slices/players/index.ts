import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "./balance";
import { worldsSlice } from "./worlds";
import { statsSlice } from "./stats";
import { slimeSlice } from "./slime";
import { upgradesSlice } from "./upgrades";
import { boostsSlice } from "./boosts";

export * from "./balance";
export * from "./worlds";
export * from "./upgrades";
export * from "./stats";
export * from "./slime";
export * from "./boosts";
export * from "./types";
export * from "./utils";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	worlds: worldsSlice,
	stats: statsSlice,
	slime: slimeSlice,
	upgrades: upgradesSlice,
	boosts: boostsSlice,
});
