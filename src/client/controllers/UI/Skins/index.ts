import { Controller, OnStart } from "@flamework/core";
import { UIClass } from "../UIClass";
import { SkinsFrame } from "./types";
import { TweenService } from "@rbxts/services";
import { UIController } from "../UIController";

@Controller()
export class Skins extends UIClass<SkinsFrame> {
	private inTween?: Tween;
	private outTween?: Tween;

	constructor(private readonly uicontroller: UIController) {
		super("UISkins");
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

		this.instance.CloseButton.MouseButton1Click.Connect(() => this.uicontroller.changeInterface());
	}

	activate(): void {
		this.inTween?.Play();
	}

	deactivate(): void {
		this.outTween?.Play();
	}
}
