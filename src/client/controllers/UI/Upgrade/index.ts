import { Controller, OnStart } from "@flamework/core";
import { UIClass } from "../UIClass";
import { UpgradeFrame } from "./types";
import { TweenService } from "@rbxts/services";
import { UIController } from "../UIController";
import Remotes from "shared/remotes";
import { PlayerUpgrades } from "shared/slices/players";
import { producer } from "client/producers";
import { selectPlayerUpgrades } from "shared/selectors";
import { upgradesCosts } from "shared/lib/upgrades";

@Controller()
export class Upgrade extends UIClass<UpgradeFrame> {
	private inTween?: Tween;
	private outTween?: Tween;

	constructor(private readonly uicontroller: UIController) {
		super("UIUpgrade");
	}

	onStart() {
		const centerPosition = this.instance.Position;
		const offscreenPosition = UDim2.fromScale(centerPosition.X.Scale, 1.5);

		this.inTween = TweenService.Create(this.instance, this.tweenInfo, {
			Position: centerPosition,
		});
		this.outTween = TweenService.Create(this.instance, this.tweenInfo, {
			Position: offscreenPosition,
		});

		this.instance.Position = offscreenPosition;
		this.instance.Visible = true;

		this.instance.CloseButton.MouseButton1Click.Connect(() => this.uicontroller.changeInterface());

		const upgradesFrame = this.instance.UpgradeFrame.Frames;
		const buyUpgradeRemote = Remotes.Client.Get("buyUpgrade");

		for (const upgrade of upgradesFrame.GetChildren()) {
			if (!upgrade.IsA("Frame")) {
				continue;
			}

			const upgradeButton = upgrade.FindFirstChild("Upgrade") as TextButton;

			if (!upgradeButton) {
				continue;
			}

			const upgradeName = `${upgrade.Name.sub(1, 1).lower()}${upgrade.Name.gsub(" ", "")[0].sub(
				2,
				-1,
			)}` as keyof PlayerUpgrades;

			upgradeButton.MouseButton1Click.Connect(() => {
				buyUpgradeRemote.SendToServer(upgradeName as keyof PlayerUpgrades);
			});
		}

		producer.subscribe(selectPlayerUpgrades(tostring(this.localPlayer.UserId)), (upgrades) => {
			if (!upgrades) {
				return;
			}

			for (const upgrade of upgradesFrame.GetChildren()) {
				if (!upgrade.IsA("Frame")) {
					continue;
				}

				const upgradeCostLabel = upgrade.FindFirstChild("Cost") as TextLabel;
				const upgradeInfoLabel = upgrade.FindFirstChild("UpgradeInfo") as TextLabel;

				if (!upgradeCostLabel || !upgradeInfoLabel) {
					continue;
				}

				const upgradeName = `${upgrade.Name.sub(1, 1).lower()}${upgrade.Name.gsub(" ", "")[0].sub(
					2,
					-1,
				)}` as keyof PlayerUpgrades;
				const upgradeLevel = upgrades[upgradeName];

				const upgradeCost = upgradesCosts[upgradeName];

				if (upgradeLevel === undefined) {
					continue;
				}

				const cost = upgradeCost + (upgradeLevel > 1 ? (upgradeCost * upgradeLevel) / 2 : 0);

				upgradeCostLabel.Text = `${cost}G`;
				upgradeInfoLabel.Text = `${upgrade.Name} Level ${upgradeLevel}/10`;
			}
		});
	}

	activate(): void {
		this.inTween?.Play();
	}

	deactivate(): void {
		this.outTween?.Play();
	}
}
