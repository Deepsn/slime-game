import { Controller, OnRender, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import CameraController from "./CameraController";

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

@Controller()
export class BoostController implements OnStart, OnRender {
	public readonly BASE_FUEL = 100;
	public enabled = false;
	public fuel = 0;

	private readonly CAMERA_SPEED = 10;
	private holding = false;
	private lastEnabled = tick();

	constructor(private readonly cameraController: CameraController) {}

	onStart(): void {
		this.fuel = this.BASE_FUEL;

		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) {
				return;
			}

			if (input.KeyCode === Enum.KeyCode.E) {
				this.holding = true;
			}
		});

		UserInputService.InputEnded.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.E) {
				this.holding = false;
			}
		});
	}

	onRender(dt: number): void {
		const camera = this.cameraController.camera;

		camera.FieldOfView = lerp(camera.FieldOfView, this.enabled ? 80 : 70, dt * this.CAMERA_SPEED);

		if (this.holding && this.fuel > 0) {
			this.fuel -= dt * 10;
			this.enabled = true;
		} else {
			if (!this.holding && tick() - this.lastEnabled > 1) {
				this.fuel += dt;
			}

			if (this.enabled) {
				this.enabled = false;
				this.lastEnabled = tick();
			}
		}
	}
}
