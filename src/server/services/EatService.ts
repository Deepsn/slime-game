import { Service, OnStart, OnInit } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { RootState, producer } from "server/producers";
import Remotes from "shared/remotes";
import { selectPlayerSlime, selectPlayerWorlds } from "shared/selectors";

@Service()
export class EatService implements OnStart {
	constructor(private logger: Logger) {}

	onStart() {
		const collectiblesRemotes = Remotes.Server.GetNamespace("collectibles");
		const collect = collectiblesRemotes.Get("collect");

		collect.Connect((player, collectibleId) => {
			const areaId = this.getPlayerArea(player);

			if (areaId === undefined) {
				return;
			}

			const collectible = this.getCollectible(areaId, collectibleId);

			if (!collectible) {
				return;
			}

			const playerSize = producer.getState(selectPlayerSlime(tostring(player.UserId)))?.size;

			if (playerSize === undefined) {
				return;
			}

			const character = player.Character;
			const root = character?.FindFirstChild("Root") as BasePart;

			if (!root) {
				return;
			}

			const origin = root.Position;
			const distance = collectible.position.sub(origin).Magnitude;

			if (distance > playerSize + 5) {
				this.logger.Warn("Player is too far away from the collectible");
				return;
			}

			if (collectible.type === "Crystal") {
				producer.changeStats(tostring(player.UserId), "points", collectible.value);
				producer.changeSlimeStat(tostring(player.UserId), "size", 1);
				producer.removeCrystal(areaId, collectibleId);
			} else if (collectible.type === "Coin") {
				producer.changeBalance(tostring(player.UserId), "coins", collectible.value);
				producer.removeCoin(areaId, collectibleId);
			}
		});
	}

	getPlayerArea(player: Player) {
		const worlds = producer.getState(selectPlayerWorlds(tostring(player.UserId)));

		return worlds?.selected;
	}

	getCollectible(areaId: `Area${number}`, id: string) {
		const selectCrystals = (state: RootState) => {
			return state.collectables.crystals;
		};

		const selectCollectibles = createSelector(selectCrystals, (crystals) => {
			return crystals[areaId];
		});

		const collectible = producer.getState(selectCollectibles);

		return collectible?.[id];
	}
}
