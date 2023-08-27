import { Controller, OnRender, OnStart } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players, Workspace } from "@rbxts/services";
import { Logger } from "@rbxts/log";
import SlimeSizeController from "./SlimeSizeController";
import { InputController } from "./InputController";
import { producer } from "client/producers";
import { selectPlayerUpgrades } from "shared/selectors";
import { createSelector } from "@rbxts/reflex";

@Controller()
export default class MovementController implements OnRender, OnStart, OnCharacter {
	private readonly BASE_SPEED = 10;
	private SPEED = 10;
	private attachment?: Attachment;
	private alignOrientation?: AlignOrientation;
	private linearVelocity?: LinearVelocity;
	private localPlayer = Players.LocalPlayer;
	private camera = Workspace.CurrentCamera!;
	private raycastParams = new RaycastParams();

	constructor(
		private logger: Logger,
		private readonly slimeSizeController: SlimeSizeController,
		private readonly inputController: InputController,
	) {}

	onStart(): void {
		const characterFolder = Workspace.WaitForChild("Characters") as Folder;
		this.raycastParams.FilterDescendantsInstances = [characterFolder];

		const selectPlayerSpeed = (playerId: string) => {
			return createSelector(selectPlayerUpgrades(playerId), (upgrades) => {
				return upgrades?.speed;
			});
		};

		producer.subscribe(selectPlayerSpeed(tostring(this.localPlayer.UserId)), (speed) => {
			if (speed === undefined) {
				return;
			}

			// add 10% to the base speed
			this.SPEED = this.BASE_SPEED * (1 + 0.1 * speed);
		});
	}

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== this.localPlayer) {
			return;
		}

		const linearVelocity = character.WaitForChild("LinearVelocity") as LinearVelocity;
		const alignOrientation = character.WaitForChild("AlignOrientation") as AlignOrientation;
		const alignPosition = character.WaitForChild("AlignPosition") as AlignPosition;
		const mainAttachment = new Instance("Attachment");
		const otherAttachment = new Instance("Attachment");
		const root = character.WaitForChild("Root");

		mainAttachment.Name = "MainAttachment";
		otherAttachment.Name = "OtherAttachment";

		linearVelocity.Attachment0 = mainAttachment;
		alignOrientation.Attachment0 = mainAttachment;

		alignPosition.Attachment0 = otherAttachment;
		alignPosition.Attachment1 = mainAttachment;

		mainAttachment.Parent = root;
		otherAttachment.Parent = Workspace.Terrain;

		otherAttachment.WorldPosition = Vector3.zero;

		this.alignOrientation = alignOrientation;
		this.linearVelocity = linearVelocity;
		this.attachment = otherAttachment;
	}

	getMoveDirection() {
		let moveDirection = this.inputController.moveDirection;

		if (moveDirection.Magnitude > 0) {
			moveDirection = moveDirection.Unit;
		}

		let [, cameraYaw] = this.camera.CFrame.ToEulerAnglesYXZ();
		cameraYaw = (cameraYaw % (math.pi * 2)) - math.pi;

		const cameraCos = math.cos(cameraYaw);
		const cameraSin = math.sin(cameraYaw);

		return new Vector3(
			-moveDirection.X * cameraCos + moveDirection.Z * cameraSin,
			0,
			moveDirection.Z * cameraCos - -moveDirection.X * cameraSin,
		);
	}

	onRender(dt: number): void {
		if (!this.linearVelocity || !this.alignOrientation || !this.attachment) {
			return;
		}

		const height = this.slimeSizeController.sizes.get(this.localPlayer.UserId) ?? 0;
		const moveDirection = this.getMoveDirection();
		const direction = moveDirection.mul(this.SPEED);
		const origin = this.camera.Focus.Position;

		this.attachment.WorldPosition = Vector3.yAxis.mul(0.3 + (height / 2) * 0.74);

		this.linearVelocity.VectorVelocity = direction;

		if (moveDirection.Magnitude > 0) {
			this.alignOrientation.CFrame = new CFrame(origin, origin.add(direction.Cross(Vector3.yAxis)));
		}
	}
}
