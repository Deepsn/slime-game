import { createProducer } from "@rbxts/reflex";
import { Collectable } from "./types";

export interface CoinsState {
	readonly [areaId: string]:
		| {
				readonly [coinId: string]: Collectable | undefined;
		  }
		| undefined;
}

const initialState: CoinsState = {};

export const coinsSlice = createProducer(initialState, {
	addCoin: (state, areaId: string, coin: Collectable) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[coin.id]: { ...coin, type: "Coin" },
		},
	}),

	removeCoin: (state, areaId: string, coinId: string) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[coinId]: undefined,
		},
	}),
});
