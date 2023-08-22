import { createProducer } from "@rbxts/reflex";
import { Coin } from "./types";

export interface CoinsState {
	readonly [areaId: string]:
		| {
				readonly [coinId: string]: Coin | undefined;
		  }
		| undefined;
}

const initialState: CoinsState = {};

export const coinsSlice = createProducer(initialState, {
	addCoin: (state, areaId: string, coin: Coin) => ({
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
