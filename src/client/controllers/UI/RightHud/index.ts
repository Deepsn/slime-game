import { Controller } from "@flamework/core";
import { UIClass } from "../UIClass";
import { RightHudFrame } from "./types";
import { Upgrade } from "../Upgrade";
import { UIController } from "../UIController";
import { Quests } from "../Quests";

@Controller()
export class RightHud extends UIClass<RightHudFrame> {
	constructor(
		private readonly uicontroller: UIController,
		private readonly upgrade: Upgrade,
		private readonly quests: Quests,
	) {
		super("UIRightHud");
	}

	onStart() {
		this.instance.Evolution.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.upgrade));
		this.instance.DailyQuest.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.quests));
	}
}
