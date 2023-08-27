import { Controller, OnRender, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import CameraController from "./CameraController";

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

@Controller()
export class BoostController implements OnStart, OnRender {
	public enabled = false;
	private readonly CAMERA_SPEED = 10;

	constructor(private readonly cameraController: CameraController) {}

	onStart(): void {
		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) {
				return;
			}

			if (input.KeyCode === Enum.KeyCode.E) {
				this.enabled = true;
			}
		});

		UserInputService.InputEnded.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.E) {
				this.enabled = false;
			}
		});
	}

	onRender(dt: number): void {
		const camera = this.cameraController.camera;

		camera.FieldOfView = lerp(camera.FieldOfView, this.enabled ? 80 : 70, dt * this.CAMERA_SPEED);
	}
}
