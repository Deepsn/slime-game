import { Controller, OnRender } from "@flamework/core";
import { UIClass } from "../UIClass";
import { BoostFrame } from "./types";
import { BoostController } from "client/controllers/BoostController";

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

@Controller()
export class Boost extends UIClass<BoostFrame> implements OnRender {
	private lastFuel = 0;

	constructor(private readonly boostController: BoostController) {
		super("UIBoost");
	}

	onStart(): void {
		this.instance.Fuel.BackgroundTransparency = 1;
		this.instance.Fuel.Visible = true;

		this.instance.ImageButton.MouseButton1Click.Connect(() => {
			this.boostController.holding = !this.boostController.holding;
		});
	}

	onRender(dt: number): void {
		if (!this.instance) {
			return;
		}

		const fuel = this.boostController.fuel;
		const maxFuel = this.boostController.MAX_FUEL;
		const fuelFrame = this.instance.Fuel;
		const isBoostEnabled = this.boostController.enabled;
		const isFuelChanged = this.lastFuel !== fuel;
		this.lastFuel = fuel;

		fuelFrame.Size = new UDim2(fuel / maxFuel, 0, 0, 3);
		fuelFrame.BackgroundTransparency = lerp(
			fuelFrame.BackgroundTransparency,
			isBoostEnabled || isFuelChanged ? 0 : 1,
			dt * 10,
		);
	}
}
