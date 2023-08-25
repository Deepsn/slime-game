import { Controller, OnStart } from "@flamework/core";
import { UIClass } from "../UIClass";
import { LevelHudFrame } from "./types";
import { producer } from "client/producers";
import { selectPlayerStats } from "shared/selectors";
import { TweenService } from "@rbxts/services";

@Controller()
export class Index extends UIClass<LevelHudFrame> implements OnStart {
	private tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.Out);

	constructor() {
		super("UILevelHud");
	}

	onStart() {
		producer.subscribe(selectPlayerStats(tostring(this.localPlayer.UserId)), (stats) => {
			if (!stats) {
				return;
			}

			TweenService.Create(this.instance.Level.LevelGUI.LevelBar, this.tweenInfo, {
				Size: UDim2.fromScale(stats.experience / stats.maxExperience, 0.673),
			}).Play();
			this.instance.Level.LevelGUI.Point.Text = `${stats.experience}/${stats.maxExperience}`;
			this.instance.Level.LevelGUI.LevelNum.Text = `${stats.level}`;
		});
	}
}