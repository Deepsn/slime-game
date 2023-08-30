import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerReceipts } from "./types";

interface ReceiptsState {
	readonly [playerId: string]: PlayerReceipts | undefined;
}

const initialState: ReceiptsState = {};

export const receiptsState = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.receipts,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	addReceipt: (state, player: string, receiptId: string) => {
		const receipt = state[player];

		return {
			...state,
			[player]: receipt !== undefined ? [...receipt, receiptId] : undefined,
		};
	},
});
