import { Service } from "@flamework/core";
import { producer } from "server/producers";
import { OnPlayer } from "./PlayerJoinService";
import { selectPlayerSlime, selectPlayerStats } from "shared/selectors";
import { createSelector } from "@rbxts/reflex";

@Service()
export class ExperienceService implements OnPlayer {
	private playerSubscriptions = new Map<Player, () => void>();

	onPlayerJoin(player: Player): void {
		const selectPlayerLevels = (playerId: string) => {
			return createSelector(selectPlayerStats(playerId), (stats) => {
				if (!stats) {
					return;
				}

				return {
					experience: stats.experience,
					maxExperience: stats.maxExperience,
					level: stats.level,
				};
			});
		};

		const unsubscribe = producer.subscribe(selectPlayerLevels(tostring(player.UserId)), (stats, lastStats) => {
			if (!stats || !lastStats) {
				return;
			}

			if (stats.experience > lastStats.experience && stats.experience >= stats.maxExperience) {
				producer.setStats(
					tostring(player.UserId),
					"maxExperience",
					stats.maxExperience + stats.maxExperience / 2,
				);
				producer.changeStats(tostring(player.UserId), "level", 1);
				producer.setStats(tostring(player.UserId), "experience", stats.experience - stats.maxExperience);

				const slimeStats = producer.getState(selectPlayerSlime(tostring(player.UserId)));

				if (slimeStats && stats.level < 100) {
					producer.setSlimeStat(tostring(player.UserId), "size", slimeStats.size * 1.4);
				}
			}
		});

		this.playerSubscriptions.set(player, unsubscribe);
	}

	onPlayerLeave(player: Player): void {
		const unsubscribe = this.playerSubscriptions.get(player);
		this.playerSubscriptions.delete(player);

		unsubscribe?.();
	}
}
