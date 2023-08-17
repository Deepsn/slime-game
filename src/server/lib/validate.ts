import { t } from "@rbxts/t";
import { PlayerData } from "shared/slices/players";

export const validate: t.check<PlayerData> = t.strictInterface({
	balance: t.strictInterface({
		coins: t.number,
	}),
	worlds: t.strictInterface({
		unlocked: t.array(t.string),
		selected: t.string,
	}),
	stats: t.strictInterface({
		level: t.number,
		experience: t.number,
	}),
	slime: t.strictInterface({
		size: t.number,
	}),
});

// readonly balance: PlayerBalance;
// 	readonly slime: PlayerSlime;
// 	readonly stats: PlayerStats;
// 	readonly worlds: PlayerWorlds;
// balance: t.strictInterface({
//     coins: t.number,
//     gems: t.number,
// }),
// inventory: t.strictInterface({
//     pets: t.array(
//         t.strictInterface({
//             id: t.string,
//             equipped: t.boolean,
//         }),
//     ),
// }),
