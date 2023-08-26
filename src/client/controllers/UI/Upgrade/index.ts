import { Controller, OnStart } from "@flamework/core";
import { UIClass } from "../UIClass";
import { UpgradeFrame } from "./types";
import { TweenService } from "@rbxts/services";

@Controller()
export class Upgrade extends UIClass<UpgradeFrame> {
	private inTween?: Tween;
	private outTween?: Tween;

	constructor() {
		super("UIUpgrade");
	}

	onStart() {
		const centerPosition = this.instance.Position;
		const offscreenPosition = UDim2.fromScale(centerPosition.X.Scale, 1.5);

		this.inTween = TweenService.Create(this.instance, this.tweenInfo, {
			Position: centerPosition,
		});
		this.outTween = TweenService.Create(this.instance, this.tweenInfo, {
			Position: offscreenPosition,
		});

		this.instance.Position = offscreenPosition;
		this.instance.Visible = true;
	}

	activate(): void {
		this.inTween?.Play();
	}

	deactivate(): void {
		this.outTween?.Play();
	}
}
