import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerLastOnline } from "./types";

export interface LastOnlineState {
	readonly [player: string]: PlayerLastOnline | undefined;
}

const initialState: LastOnlineState = {};

export const lastonlineSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.lastOnline,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),
});
