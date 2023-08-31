import { Controller } from "@flamework/core";
import { UIClass } from "../UIClass";
import { LeftHudFrame } from "./types";
import { UIController } from "../UIController";
import { Shop } from "../Shop";

@Controller()
export class LeftHud extends UIClass<LeftHudFrame> {
	constructor(
		private readonly uicontroller: UIController,
		private readonly shop: Shop,
	) {
		super("UILeftHud");
	}

	onStart() {
		this.instance.Shop.MouseButton1Click.Connect(() => this.uicontroller.changeInterface(this.shop));
	}
}
