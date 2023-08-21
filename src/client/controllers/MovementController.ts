import { Controller, OnRender, OnStart } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players, Workspace } from "@rbxts/services";
import { Logger } from "@rbxts/log";
import SlimeSizeController from "./SlimeSizeController";
import { InputController } from "./InputController";

@Controller()
export default class MovementController implements OnRender, OnStart, OnCharacter {
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
	}

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== this.localPlayer) {
			return;
		}

		const linearVelocity = character.WaitForChild("LinearVelocity") as LinearVelocity;
		const alignOrientation = character.WaitForChild("AlignOrientation") as AlignOrientation;
		const planeConstraint = new Instance("PlaneConstraint");
		const mainAttachment = new Instance("Attachment");
		const otherAttachment = new Instance("Attachment");
		const root = character.WaitForChild("Root");

		mainAttachment.Name = "MainAttachment";
		otherAttachment.Name = "OtherAttachment";

		linearVelocity.Attachment0 = mainAttachment;
		alignOrientation.Attachment0 = mainAttachment;

		planeConstraint.Attachment0 = mainAttachment;
		planeConstraint.Attachment1 = otherAttachment;

		mainAttachment.Parent = root;
		otherAttachment.Parent = root;

		this.alignOrientation = alignOrientation;
		this.linearVelocity = linearVelocity;
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
		if (!this.linearVelocity || !this.alignOrientation) {
			return;
		}

		const height = this.slimeSizeController.size;
		const moveDirection = this.getMoveDirection();
		const direction = moveDirection.mul(16 * dt * 60);
		const origin = this.camera.Focus.Position;

		this.linearVelocity.VectorVelocity = direction;

		const result = Workspace.Raycast(origin, Vector3.yAxis.mul(-1), this.raycastParams);

		if (!result) {
			this.linearVelocity.VectorVelocity = new Vector3(direction.X, -1, direction.Z);
		}

		// const position = this.attachment.WorldPosition.mul(new Vector3(1, 0, 1)).add(
		// 	Vector3.yAxis.mul((height / 2) * 0.74),
		// );

		// const newPosition = position.add(direction);

		// this.attachment.WorldPosition = newPosition;

		if (moveDirection.Magnitude > 0) {
			const invertedMoveDirection = moveDirection.mul(-1);
			const angle = math.deg(math.atan2(invertedMoveDirection.X, invertedMoveDirection.Z));

			this.alignOrientation.CFrame = new CFrame(origin, origin.add(direction.Cross(Vector3.yAxis)));
			// 	this.attachment.WorldOrientation = Vector3.yAxis.mul(angle - 90);
		}
	}
}
