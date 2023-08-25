import { Controller } from "@flamework/core";
import { UIClass } from "../UIClass";
import { MoneyHudFrame } from "./types";
import { producer } from "client/producers";
import { selectPlayerBalance } from "shared/selectors";

@Controller()
export class MoneyHud extends UIClass<MoneyHudFrame> {
	constructor() {
		super("UIMoneyHud");
	}

	onStart() {
		producer.subscribe(selectPlayerBalance(tostring(this.localPlayer.UserId)), (balance) => {
			if (!balance) {
				return;
			}

			this.instance.Coins.Coins.Text = `${balance.coins}`;
		});
	}
}
