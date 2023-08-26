import { Controller } from "@flamework/core";
import { UIClass } from "./UIClass";
import { RootState, producer } from "client/producers";
import { selectPlayerBalance, selectPlayerStats } from "shared/selectors";
import { createSelector } from "@rbxts/reflex";
import { TweenService } from "@rbxts/services";

@Controller()
export class Popups extends UIClass<TextLabel> {
	constructor() {
		super("UIPopup");
	}

	onStart() {
		const selectPlayerExperience = (playerId: string) => {
			return createSelector(selectPlayerStats(playerId), (stats) => {
				return stats?.experience;
			});
		};

		const selectPlayerCoins = (playerId: string) => {
			return createSelector(selectPlayerBalance(playerId), (balance) => {
				return balance?.coins;
			});
		};

		const didIncrease = (current: number | undefined, previous: number | undefined) => {
			if (current === undefined || previous === undefined) {
				return false;
			}

			return current > previous;
		};

		const createPopup = (points: number | undefined, lastPoints: number | undefined, typeEmoji: string) => {
			if (points === undefined || lastPoints === undefined) {
				return;
			}

			const pointsDiff = points - lastPoints;

			if (pointsDiff <= 0) {
				return;
			}

			const popup = this.instance.Clone();
			const goalPosition = UDim2.fromScale(math.random(3, 7) / 10, math.random(3, 7) / 10);

			popup.RemoveTag("UIPopup");
			popup.Text = `+${pointsDiff} ${typeEmoji}`;
			popup.Position = goalPosition.add(UDim2.fromOffset(0, 50));
			popup.TextTransparency = 1;
			popup.TextStrokeTransparency = 1;
			popup.Visible = true;

			popup.Parent = this.instance.Parent;

			const inTween = TweenService.Create(popup, this.tweenInfo, {
				TextTransparency: 0,
				TextStrokeTransparency: this.instance.TextStrokeTransparency,
				Position: goalPosition,
			});
			const outTween = TweenService.Create(popup, this.tweenInfo, {
				TextTransparency: 0,
				TextStrokeTransparency: this.instance.TextStrokeTransparency,
				Position: goalPosition,
			});

			inTween.Play();

			const inDisconnect = inTween.Completed.Connect(() => {
				inDisconnect.Disconnect();
				outTween.Play();
			});

			const outDisconnect = outTween.Completed.Connect(() => {
				outDisconnect.Disconnect();
				task.delay(1, () => popup.Destroy());
			});
		};

		producer.subscribe(
			selectPlayerExperience(tostring(this.localPlayer.UserId)),
			didIncrease,
			(experience, lastExperience) => createPopup(experience, lastExperience, "✨"),
		);

		producer.subscribe(selectPlayerCoins(tostring(this.localPlayer.UserId)), didIncrease, (coins, lastCoins) =>
			createPopup(coins, lastCoins, "🪙"),
		);
	}
}
