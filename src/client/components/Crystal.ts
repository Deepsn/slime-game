import { OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Workspace } from "@rbxts/services";
import { RenderController } from "client/controllers/RenderController";

interface CrystalAttributes {
	position?: Vector3;
}

@Component({ tag: "Crystal" })
export class Crystal extends BaseComponent<CrystalAttributes, MeshPart> implements OnTick {
	private originalPosition = this.instance.Position;
	private orientationTick = 0;
	private camera = Workspace.CurrentCamera!;

	constructor(private readonly renderController: RenderController) {
		super();
	}

	onTick(dt: number): void {
		const distance = this.camera.CFrame.Position.sub(this.instance.Position).Magnitude;

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

		const offsetY = math.cos(tick()) / 10;

		this.instance.Position = this.attributes.position ?? this.originalPosition.add(Vector3.yAxis.mul(offsetY));
		this.instance.Orientation = Vector3.yAxis.mul(this.orientationTick);
	}
}
