import { Service, OnStart } from "@flamework/core";
import { producer } from "server/producers";
import { selectPlayerBoosts } from "shared/selectors";
import { OnPlayer } from "./PlayerJoinService";
import { PlayerBoosts } from "shared/slices/players";

@Service()
export class BoostService implements OnPlayer {
	private boostsActive = new Map<Player, Map<keyof PlayerBoosts, number>>();

	onPlayerJoin(player: Player): void {
		this.boostsActive.set(player, new Map());

		const setBoostActive = (
			boostsActive: Map<keyof PlayerBoosts, number>,
			boosts: PlayerBoosts,
			boostName: keyof PlayerBoosts,
		) => {
			const boost = boosts[boostName];

			if (!boost || boostsActive.has(boostName)) {
				return;
			}

			const playerKey = tostring(player.UserId);

			task.delay(boost.timeLeft, () => {
				producer.removeBoost(playerKey, boostName);
				boostsActive.delete(boostName);
			});

			boostsActive.set(boostName, tick() + boost.timeLeft);
			producer.setBoost(playerKey, boostName, { ...boost, endTick: tick() + boost.timeLeft });
		};

		producer.subscribe(selectPlayerBoosts(tostring(player.UserId)), (boosts) => {
			if (!boosts) {
				return;
			}

			const boostsActive = this.boostsActive.get(player);

			if (!boostsActive) {
				return;
			}

			if (boosts.coins2x) {
				setBoostActive(boostsActive, boosts, "coins2x");
			}

			if (boosts.magnet2x) {
				setBoostActive(boostsActive, boosts, "magnet2x");
			}

			if (boosts.xp2x) {
				setBoostActive(boostsActive, boosts, "xp2x");
			}
		});
	}

	onPlayerLeave(player: Player): void {
		const boostsActive = this.boostsActive.get(player);
		this.boostsActive.delete(player);

		if (boostsActive) {
			const playerKey = tostring(player.UserId);
			const now = tick();

			for (const [boostName, endTick] of boostsActive) {
				if (endTick > now) {
					const tickLeft = endTick - now; // seconds

					producer.setBoost(playerKey, boostName, {
						endTick,
						timeLeft: tickLeft,
					});
				} else {
					producer.removeBoost(playerKey, boostName);
				}
			}
		}
	}
}
