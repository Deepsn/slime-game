import { PlayerBoosts } from "shared/slices/players";

export interface Ids {
	readonly boosts: {
		[K in keyof PlayerBoosts]: number;
	};
}
