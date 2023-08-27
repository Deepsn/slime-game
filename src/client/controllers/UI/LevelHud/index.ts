import { Controller } from "@flamework/core";
import { UIClass } from "../UIClass";
import { LevelHudFrame } from "./types";
import { producer } from "client/producers";
import { selectPlayerStats, selectPlayerWorlds } from "shared/selectors";
import { TweenService } from "@rbxts/services";
import { createSelector } from "@rbxts/reflex";
import { worldsLevel } from "shared/lib/worlds";

@Controller()
export class LevelHud extends UIClass<LevelHudFrame> {
	constructor() {
		super("UILevelHud");
	}

	onStart() {
		const selectPlayerCurrentWorld = (playerId: string) => {
			return createSelector(selectPlayerWorlds(playerId), (worlds) => {
				return worlds?.selected;
			});
		};

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

		producer.subscribe(selectPlayerCurrentWorld(tostring(this.localPlayer.UserId)), (area) => {
			if (area === undefined) {
				return;
			}

			const currentWorldId = tonumber(area.match("%d")[0]);

			if (currentWorldId === undefined) {
				return;
			}

			const nextWorldLevel = worldsLevel[`Area${currentWorldId + 1}`];

			if (nextWorldLevel === undefined) {
				this.instance.Level.Title.Visible = false;
				return;
			}

			this.instance.Level.Title.Visible = true;
			this.instance.Level.Title.Text = `New world at level ${nextWorldLevel}`;
		});
	}
}
