import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/slices";

export type RootState = InferState<typeof producer>;

export const producer = combineProducers({
	...slices,
});
