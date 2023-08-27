import { Controller } from "@flamework/core";
import { UIClass } from "./UIClass";
import { producer } from "client/producers";
import { createSelector } from "@rbxts/reflex";
import { selectPlayerWorlds } from "shared/selectors";
import { TweenService } from "@rbxts/services";

@Controller()
export class Transitions extends UIClass<Frame> {
	constructor() {
		super("UITransition");
	}

	onStart() {
		const selectPlayerSelectedWorld = (playerId: string) => {
			return createSelector(selectPlayerWorlds(playerId), (worlds) => {
				return worlds?.selected;
			});
		};

		const tweenInfo = new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 0);

		producer.subscribe(selectPlayerSelectedWorld(tostring(this.localPlayer.UserId)), (selectedWorld) => {
			if (selectedWorld === undefined) {
				this.instance.BackgroundTransparency = 1;
				this.instance.Visible = true;
				TweenService.Create(this.instance, tweenInfo, {
					BackgroundTransparency: 0,
				}).Play();
				return;
			}

			this.instance.BackgroundTransparency = 0;
			this.instance.Visible = true;
			const outTween = TweenService.Create(this.instance, tweenInfo, {
				BackgroundTransparency: 1,
			});

			outTween.Play();
			const disconnect = outTween.Completed.Connect(() => {
				disconnect.Disconnect();
				this.instance.Visible = false;
			});
		});
	}
}
