import { Service } from "@flamework/core";
import { producer } from "server/producers";
import { selectPlayerBoosts, selectPlayerLastOnline } from "shared/selectors";
import { OnPlayer } from "./PlayerJoinService";
import { PlayerBoost, PlayerBoosts } from "shared/slices/players";
import { createSelector } from "@rbxts/reflex";

@Service()
export class BoostService implements OnPlayer {
	private boostsActive = new Map<Player, Map<keyof PlayerBoosts, number>>();

	onPlayerJoin(player: Player): void {
		const boostsActive = new Map<keyof PlayerBoosts, number>();
		const playerKey = tostring(player.UserId);
		this.boostsActive.set(player, boostsActive);

		const removeBoost = (boostName: keyof PlayerBoosts) => {
			producer.removeBoost(playerKey, boostName);
			boostsActive.delete(boostName);
		};

		const setBoostActive = (boost: PlayerBoost | undefined, boostName: keyof PlayerBoosts) => {
			if (!boost || boostsActive.has(boostName)) {
				return;
			}

			const lastOnline = producer.getState(selectPlayerLastOnline(playerKey));
			const now = DateTime.now().UnixTimestamp;

			const estimatedTimeLeft = boost.timeLeft;
			const calculatedTimeLeft = lastOnline ? boost.endTick - lastOnline : 9e9;

			const timeLeft = calculatedTimeLeft > estimatedTimeLeft ? estimatedTimeLeft : calculatedTimeLeft;

			task.delay(timeLeft, () => removeBoost(boostName));

			boostsActive.set(boostName, now + timeLeft);
			producer.setBoost(playerKey, boostName, { timeLeft, endTick: now + timeLeft });
		};

		const selectPlayerBoost = (boostName: keyof PlayerBoosts) => {
			return createSelector(selectPlayerBoosts(playerKey), (boosts) => {
				return boosts?.[boostName];
			});
		};

		producer.subscribe(selectPlayerBoost("coins2x"), (boost) => setBoostActive(boost, "coins2x"));
		producer.subscribe(selectPlayerBoost("magnet2x"), (boost) => setBoostActive(boost, "magnet2x"));
		producer.subscribe(selectPlayerBoost("xp2x"), (boost) => setBoostActive(boost, "xp2x"));
	}
}
