import { Service, OnStart } from "@flamework/core";
import { createSelector } from "@rbxts/reflex";
import { upgradesCosts } from "shared/lib/upgrades";
import { producer } from "server/producers";
import Remotes from "shared/remotes";
import { selectPlayerBalance, selectPlayerUpgrades } from "shared/selectors";
import { PlayerUpgrades } from "shared/slices/players";

@Service()
export class UpgradesService implements OnStart {
	onStart() {
		const buyUpgradeRemote = Remotes.Server.Get("buyUpgrade");

		const selectPlayerUpgrade = (playerId: string, upgradeName: keyof PlayerUpgrades) => {
			return createSelector(selectPlayerUpgrades(playerId), (upgrades) => {
				return upgrades?.[upgradeName];
			});
		};

		const selectPlayerCoins = (playerId: string) => {
			return createSelector(selectPlayerBalance(playerId), (balance) => {
				return balance?.coins;
			});
		};

		buyUpgradeRemote.Connect((player, upgradeName) => {
			const upgradeCost = upgradesCosts[upgradeName];

			if (upgradeCost === undefined) {
				return;
			}

			const playerCoins = producer.getState(selectPlayerCoins(tostring(player.UserId)));

			if (playerCoins === undefined || playerCoins < upgradeCost) {
				return;
			}

			const playerUpgradeLevel = producer.getState(selectPlayerUpgrade(tostring(player.UserId), upgradeName));

			if (playerUpgradeLevel === undefined) {
				return;
			}

			const calculatedCost = upgradeCost + (playerUpgradeLevel > 1 ? (upgradeCost * playerUpgradeLevel) / 2 : 0);

			producer.changeBalance(tostring(player.UserId), "coins", -calculatedCost);
			producer.addUpgrade(tostring(player.UserId), upgradeName);
		});
	}
}
