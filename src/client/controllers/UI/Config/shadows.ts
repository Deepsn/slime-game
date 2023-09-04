import { Controller, OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";

@Controller()
export class ShadowsConfig implements OnStart {
	private readonly THREADS = 15;
	private objects = new Set<BasePart>();
	private state = 0;

	onStart() {
		let index = 0;
		for (const object of Workspace.GetDescendants()) {
			index++;

			if (index % this.THREADS === 0) {
				task.wait();
			}

			if (object.IsA("BasePart") && object.CastShadow) {
				this.objects.add(object);
			}
		}
	}

	apply() {
		if (this.state === 1) {
			return;
		}

		this.state = 1;
		let index = 0;

		for (const object of this.objects) {
			if (this.state !== 1) {
				break;
			}

			index++;

			if (index % this.THREADS === 0) {
				task.wait();
			}

			object.CastShadow = true;
		}
	}

	unapply() {
		if (this.state === 0) {
			return;
		}

		this.state = 0;
		let index = 0;

		for (const object of this.objects) {
			if (this.state !== 0) {
				break;
			}

			index++;

			if (index % this.THREADS === 0) {
				task.wait();
			}

			object.CastShadow = false;
		}
	}
}
