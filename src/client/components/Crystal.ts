import { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

@Component({ tag: "Crystal" })
export class Crystal extends BaseComponent<{}, MeshPart> implements OnStart, OnTick {
	private originalPosition = this.instance.Position;
	private orientationTick = 0;

	onStart() {}

	onTick(dt: number): void {
		this.orientationTick += dt * 60;

		const offsetY = math.cos(tick()) / 10;

		this.instance.Position = this.originalPosition.add(Vector3.yAxis.mul(offsetY));
		this.instance.Orientation = Vector3.yAxis.mul(this.orientationTick);
	}
}
