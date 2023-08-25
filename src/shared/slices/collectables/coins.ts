import { createProducer } from "@rbxts/reflex";
import { Coin } from "./types";

export interface CoinsState {
	readonly [areaId: `Area${number}`]:
		| {
				readonly [coinId: string]: Coin | undefined;
		  }
		| undefined;
}

const initialState: CoinsState = {};

export const coinsSlice = createProducer(initialState, {
	addCoin: (state, areaId: `Area${number}`, coin: Coin) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[coin.id]: { ...coin, areaId, originalPosition: coin.position, type: "Coin" },
		},
	}),

	removeCoin: (state, areaId: `Area${number}`, coinId: string) => ({
		...state,
		[areaId]: {
			...state[areaId],
			[coinId]: undefined,
		},
	}),
});
