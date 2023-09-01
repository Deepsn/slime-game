import { Controller } from "@flamework/core";
import { UIClass } from "../UIClass";
import { LeftHudFrame } from "./types";
import { UIController } from "../UIController";
import { Shop } from "../Shop";
import { Leaderboard } from "../Leaderboard";

@Controller()
export class LeftHud extends UIClass<LeftHudFrame> {
	constructor(
		private readonly uicontroller: UIController,
		private readonly shop: Shop,
		private readonly leaderboard: Leaderboard,
	) {
		super("UILeftHud");
	}

	onStart() {
		this.instance.Shop.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.shop));
		this.instance.Leaderboard.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.leaderboard));
	}
}
