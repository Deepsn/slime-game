import { Controller, OnStart } from "@flamework/core";
import { UIClass } from "../UIClass";
import { ConfigFrame } from "./types";
import { TweenService } from "@rbxts/services";
import { UIController } from "../UIController";
import { ShadowsConfig } from "./shadows";

@Controller()
export class Config extends UIClass<ConfigFrame> {
	private inTween?: Tween;
	private outTween?: Tween;

	constructor(
		private readonly uicontroller: UIController,
		private readonly shadowsConfig: ShadowsConfig,
	) {
		super("UIConfig");
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

		this.listenForClicks(this.instance.QuestsFrame.Frames.Shadows, this.shadowsConfig);
	}

	activate(): void {
		this.inTween?.Play();
	}

	deactivate(): void {
		this.outTween?.Play();
	}

	listenForClicks(
		frame: Frame & { Enable: ImageButton; Disable: ImageButton },
		config: { apply(): void; unapply(): void },
	) {
		frame.Enable.MouseButton1Click.Connect(() => config.apply());
		frame.Disable.MouseButton1Click.Connect(() => config.unapply());
	}
}
