import { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

@Component({ tag: "Coin" })
export class Coin extends BaseComponent<{}, Model> implements OnStart, OnTick {
	private originalPosition = this.instance.GetPivot().mul(CFrame.Angles(0, 0, math.rad(90)));
	private orientationTick = 0;

	onStart() {}

	onTick(dt: number): void {
		if (this.orientationTick === 360) {
			this.orientationTick = 0;
		}

		this.orientationTick += dt * 60;

		if (this.orientationTick >= 360) {
			this.orientationTick = 360;
		}

		this.instance.PivotTo(this.originalPosition.mul(CFrame.Angles(math.rad(this.orientationTick), 0, 0)));
	}
}
