import { Controller, OnRender, OnStart } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import CameraController from "./CameraController";
import { createSelector } from "@rbxts/reflex";
import { selectPlayerUpgrades } from "shared/selectors";
import { producer } from "client/producers";

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

@Controller()
export class BoostController implements OnStart, OnRender {
	public MAX_FUEL = 0;
	public enabled = false;
	public fuel = 0;
	public holding = false;

	private readonly BASE_FUEL = 3; // seconds
	private readonly CAMERA_SPEED = 10;
	private lastEnabled = tick();
	private localPlayer = Players.LocalPlayer;

	constructor(private readonly cameraController: CameraController) {}

	onStart(): void {
		this.fuel = this.BASE_FUEL;
		this.MAX_FUEL = this.BASE_FUEL;

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

		const selectPlayerBoostUpgrade = (playerId: string) => {
			return createSelector(selectPlayerUpgrades(playerId), (upgrades) => {
				return upgrades?.booster;
			});
		};

		producer.subscribe(selectPlayerBoostUpgrade(tostring(this.localPlayer.UserId)), (upgrade) => {
			if (!upgrade) {
				return;
			}

			// add 30% with the base fuel to the max fuel
			this.MAX_FUEL = this.BASE_FUEL * (1 + 0.3 * upgrade);
		});
	}

	onRender(dt: number): void {
		const camera = this.cameraController.camera;

		camera.FieldOfView = lerp(camera.FieldOfView, this.enabled ? 80 : 70, dt * this.CAMERA_SPEED);

		if (this.holding && this.fuel > 0) {
			this.fuel -= dt;
			this.enabled = true;
		} else {
			if (!this.holding && this.fuel < this.MAX_FUEL && tick() - this.lastEnabled > 1) {
				this.fuel = math.min(this.fuel + dt, this.MAX_FUEL);
			}

			if (this.enabled) {
				this.holding = false;
				this.enabled = false;
				this.lastEnabled = tick();
			}
		}
	}
}
