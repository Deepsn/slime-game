import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/slices";

export type RootProducer = typeof producer;

export type RootState = InferState<RootProducer>;

export const producer = combineProducers({
	...slices,
});
