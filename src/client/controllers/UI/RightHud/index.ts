import { Controller } from "@flamework/core";
import { UIClass } from "../UIClass";
import { RightHudFrame } from "./types";
import { Upgrade } from "../Upgrade";
import { UIController } from "../UIController";
import { Quests } from "../Quests";
import { Config } from "../Config";
import { Skins } from "../Skins";

@Controller()
export class RightHud extends UIClass<RightHudFrame> {
	constructor(
		private readonly uicontroller: UIController,
		private readonly upgrade: Upgrade,
		private readonly quests: Quests,
		private readonly config: Config,
		private readonly skins: Skins,
	) {
		super("UIRightHud");
	}

	onStart() {
		this.instance.DailyQuest.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.quests));
		this.instance.Evolution.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.upgrade));
		this.instance.Skins.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.skins));
		this.instance.Config.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.config));
	}
}
