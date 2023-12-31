import { Service, OnStart } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinService";
import { createSelector } from "@rbxts/reflex";
import { selectPlayerStats, selectPlayerWorlds } from "shared/selectors";
import { producer } from "server/producers";
import { worldsLevel } from "shared/lib/worlds";

@Service()
export class WorldLevelService implements OnPlayer {
	private playerSubscriptions = new Map<Player, () => void>();

	onPlayerJoin(player: Player): void {
		const selectPlayerLevel = (playerId: string) => {
			return createSelector(selectPlayerStats(playerId), (stats) => {
				if (!stats) {
					return;
				}

				return stats.level;
			});
		};

		const didLevelIncrease = (level: number | undefined, lastLevel: number | undefined) => {
			if (!level || !lastLevel) {
				return false;
			}

			return level > lastLevel;
		};

		const unsubscribe = producer.subscribe(selectPlayerLevel(tostring(player.UserId)), (level, lastLevel) => {
			if (level !== undefined && lastLevel === undefined) {
				let currentWorld, currentWorldLevel;

				for (const [worldName, minLevel] of pairs(worldsLevel)) {
					if (level >= minLevel) {
						producer.addWorld(tostring(player.UserId), worldName);

						if (!currentWorldLevel || minLevel > currentWorldLevel) {
							currentWorld = worldName;
							currentWorldLevel = minLevel;
						}
					}
				}

				if (currentWorld) {
					producer.setSelectedWorld(tostring(player.UserId), currentWorld);
				}
			}

			const increased = didLevelIncrease(level, lastLevel);

			if (!level || !lastLevel || !increased) {
				return;
			}

			const worlds = producer.getState(selectPlayerWorlds(tostring(player.UserId)));

			if (!worlds || !worlds.selected) {
				return;
			}

			const currentWorldId = tonumber(worlds.selected.match("%d+")[0]);

			if (!currentWorldId) {
				return;
			}

			const nextWorldId = currentWorldId + 1;
			const nextWorldMinLevel = worldsLevel[`Area${nextWorldId}`];

			if (!nextWorldMinLevel) {
				return;
			}

			if (level >= nextWorldMinLevel) {
				producer.addWorld(tostring(player.UserId), `Area${nextWorldId}`);
				producer.setSelectedWorld(tostring(player.UserId), undefined);

				task.delay(2, () => producer.setSelectedWorld(tostring(player.UserId), `Area${nextWorldId}`));
			}
		});

		this.playerSubscriptions.set(player, unsubscribe);
	}

	onPlayerLeave(player: Player): void {
		const unsubscribe = this.playerSubscriptions.get(player);
		unsubscribe?.();
		this.playerSubscriptions.delete(player);
	}
}
