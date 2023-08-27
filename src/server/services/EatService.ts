import { Service, OnStart, OnInit } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { RootState, producer } from "server/producers";
import Remotes from "shared/remotes";
import { selectPlayerSlime, selectPlayerStats, selectPlayerWorlds } from "shared/selectors";
import { RespawnService } from "./RespawnService";
import { defaultPlayerData } from "shared/slices/players";
import { CoinsSpawnerService } from "./CollectablesSpawner/CoinsSpawnerService";
import { CrystalsSpawnerService } from "./CollectablesSpawner/CrystalsSpawnerService";

@Service()
export class EatService implements OnStart {
	constructor(
		private logger: Logger,
		private readonly respawnService: RespawnService,
		private readonly coinsSpawnerService: CoinsSpawnerService,
		private readonly crystalsSpawnerService: CrystalsSpawnerService,
	) {}

	onStart() {
		const collectiblesRemotes = Remotes.Server.GetNamespace("collectibles");
		const collect = collectiblesRemotes.Get("collect");
		const eatPlayer = Remotes.Server.Get("eatPlayer");

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
				this.crystalsSpawnerService.spawnAmount--;
				producer.removeCrystal(areaId, collectibleId);
				producer.changeStats(tostring(player.UserId), "experience", collectible.value);
			} else if (collectible.type === "Coin") {
				this.coinsSpawnerService.spawnAmount--;
				producer.removeCoin(areaId, collectibleId);
				producer.changeBalance(tostring(player.UserId), "coins", collectible.value);
			}
		});

		eatPlayer.Connect((player, targetPlayerId) => {
			const target = Players.GetPlayerByUserId(targetPlayerId);

			if (!target) {
				return;
			}

			// characters check

			const targetCharacter = target.Character;
			const targetRoot = targetCharacter?.FindFirstChild("Root") as BasePart;

			if (!targetRoot) {
				return;
			}

			const character = target.Character;
			const root = character?.FindFirstChild("Root") as BasePart;

			if (!root) {
				return;
			}

			const targetSize = producer.getState(selectPlayerSlime(tostring(target.UserId)))?.size;

			if (targetSize === undefined) {
				return;
			}

			const playerSize = producer.getState(selectPlayerSlime(tostring(player.UserId)))?.size;

			if (playerSize === undefined) {
				return;
			}

			// size check
			if (targetSize >= playerSize) {
				return;
			}

			// distance check
			const origin = root.Position;
			const targetPosition = targetRoot.Position;

			const distance = targetPosition.sub(origin).Magnitude;

			if (distance > playerSize + 5) {
				this.logger.Warn("Player is too far away from the target player");
				return;
			}

			const inForceField = producer.getState(selectPlayerStats(tostring(target.UserId)))?.forcefield;

			if (inForceField || inForceField === undefined) {
				return;
			}

			this.logger.Info("Adding {size} to {player}", targetSize, player.Name);

			// eat
			// producer.setSlimeStat(tostring(target.UserId), "size", 1);
			producer.setStats(tostring(player.UserId), "level", defaultPlayerData.stats.level);
			producer.setStats(tostring(player.UserId), "experience", defaultPlayerData.stats.experience);
			producer.setStats(tostring(player.UserId), "maxExperience", defaultPlayerData.stats.maxExperience);

			this.respawnService.spawn(target);

			producer.changeSlimeStat(tostring(player.UserId), "size", targetSize);
			producer.changeStats(tostring(player.UserId), "kills", 1);
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

		const selectCoins = (state: RootState) => {
			return state.collectables.coins;
		};

		const selectCollectible = (id: string) => {
			return createSelector(selectCrystals, selectCoins, (crystals, coins) => {
				return crystals[areaId]?.[id] ?? coins[areaId]?.[id];
			});
		};

		return producer.getState(selectCollectible(id));
	}
}
