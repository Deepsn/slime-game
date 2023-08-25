import { OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { RenderController } from "client/controllers/RenderController";
import { Workspace } from "@rbxts/services";

@Component({ tag: "Coin" })
export class Coin extends BaseComponent<{}, Model> implements OnTick {
	private originalPosition = this.instance.GetPivot().mul(CFrame.Angles(0, 0, math.rad(90)));
	private orientationTick = 0;
	private camera = Workspace.CurrentCamera!;

	constructor(private readonly renderController: RenderController) {
		super();
	}

	onTick(dt: number): void {
		const distance = this.camera.CFrame.Position.sub(this.instance.GetPivot().Position).Magnitude;

		if (distance > this.renderController.RENDER_DISTANCE) {
			return;
		}

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
