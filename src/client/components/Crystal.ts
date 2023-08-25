import { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface CrystalAttributes {
	position?: Vector3;
}

@Component({ tag: "Crystal" })
export class Crystal extends BaseComponent<CrystalAttributes, MeshPart> implements OnStart, OnTick {
	private originalPosition = this.instance.Position;
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

		const offsetY = math.cos(tick()) / 10;

		this.instance.Position = this.attributes.position ?? this.originalPosition.add(Vector3.yAxis.mul(offsetY));
		this.instance.Orientation = Vector3.yAxis.mul(this.orientationTick);
	}
}
