import { Service } from "@flamework/core";
import { producer } from "server/producers";
import { selectPlayerBoosts, selectPlayerLastOnline } from "shared/selectors";
import { OnPlayer } from "./PlayerJoinService";
import { PlayerBoost, PlayerBoosts } from "shared/slices/players";
import { createSelector } from "@rbxts/reflex";

@Service()
export class BoostService implements OnPlayer {
	onPlayerJoin(player: Player): void {
		const boostsActive = new Map<
			keyof PlayerBoosts,
			{ receiptId: string; cancelThread: thread; timeLeft: number }
		>();
		const playerKey = tostring(player.UserId);

		const removeBoost = (boostName: keyof PlayerBoosts) => {
			producer.removeBoost(playerKey, boostName);
			boostsActive.delete(boostName);
		};

		const setBoostActive = (boost: PlayerBoost | undefined, boostName: keyof PlayerBoosts) => {
			if (!boost) {
				return;
			}

			const boostActive = boostsActive.get(boostName);

			if (boost.receiptId === boostActive?.receiptId) {
				return;
			}

			const now = DateTime.now().UnixTimestamp;

			if (boostActive && boost.receiptId !== boostActive.receiptId) {
				task.cancel(boostActive.cancelThread);

				const timeLeft = boostActive.timeLeft + boost.timeLeft;

				const cancelThread = task.delay(timeLeft, () => removeBoost(boostName));

				boostsActive.set(boostName, { receiptId: boost.receiptId, cancelThread, timeLeft });
				producer.setBoost(playerKey, boostName, { ...boost, timeLeft, endTick: now + timeLeft });
				return;
			}

			const lastOnline = producer.getState(selectPlayerLastOnline(playerKey));

			const estimatedTimeLeft = boost.timeLeft;
			const calculatedTimeLeft = lastOnline ? boost.endTick - lastOnline : 9e9;

			const timeLeft = calculatedTimeLeft > estimatedTimeLeft ? estimatedTimeLeft : calculatedTimeLeft;
			const cancelThread = task.delay(timeLeft, () => removeBoost(boostName));

			boostsActive.set(boostName, { receiptId: boost.receiptId, cancelThread, timeLeft });
			producer.setBoost(playerKey, boostName, { ...boost, timeLeft, endTick: now + timeLeft });
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
