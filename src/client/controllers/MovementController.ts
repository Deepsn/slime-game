import { Controller, OnRender, OnStart } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players, Workspace } from "@rbxts/services";
import { Logger } from "@rbxts/log";
import SlimeSizeController from "./SlimeSizeController";

interface Controls {
	GetMoveVector(): Vector3;
}

@Controller()
export default class MovementController implements OnStart, OnRender, OnCharacter {
	private attachment?: Attachment;
	private localPlayer = Players.LocalPlayer;
	private controls?: Controls;
	private camera = Workspace.CurrentCamera!;

	constructor(
		private logger: Logger,
		private readonly slimeSizeController: SlimeSizeController,
	) {}

	onStart(): void | Promise<void> {
		const playerScripts = this.localPlayer.WaitForChild("PlayerScripts") as Folder;
		const playerModule = require(playerScripts.WaitForChild("PlayerModule") as ModuleScript) as {
			GetControls(): Controls;
		};
		const controlModule = playerModule.GetControls();
		this.controls = controlModule;
	}

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== this.localPlayer) {
			return;
		}

		const alignPosition = character.WaitForChild("AlignPosition") as AlignPosition;
		const alignOrientation = character.WaitForChild("AlignOrientation") as AlignOrientation;
		const mainAttachment = new Instance("Attachment");
		const otherAttachment = new Instance("Attachment");
		const root = character.WaitForChild("Root");

		mainAttachment.Name = "MainAttachment";
		otherAttachment.Name = "OtherAttachment";

		alignPosition.Attachment0 = otherAttachment;
		alignPosition.Attachment1 = mainAttachment;

		alignOrientation.Attachment0 = otherAttachment;
		alignOrientation.Attachment1 = mainAttachment;

		mainAttachment.Parent = Workspace.Terrain;
		otherAttachment.Parent = root;

		this.attachment = mainAttachment;
	}

	getMoveDirection() {
		let moveDirection = this.controls?.GetMoveVector() ?? Vector3.zero;

		if (moveDirection.Magnitude > 0) {
			moveDirection = moveDirection.Unit;
		}

		let [, cameraYaw] = this.camera.CFrame.ToEulerAnglesYXZ();
		cameraYaw = (cameraYaw % (math.pi * 2)) - math.pi;

		const cameraCos = math.cos(cameraYaw);
		const cameraSin = math.sin(cameraYaw);

		return new Vector3(
			-moveDirection.X * cameraCos + -moveDirection.Z * cameraSin,
			0,
			-moveDirection.Z * cameraCos - -moveDirection.X * cameraSin,
		);
	}

	onRender(dt: number): void {
		if (!this.attachment) {
			return;
		}

		const height = this.slimeSizeController.size;
		const moveDirection = this.getMoveDirection();
		const direction = moveDirection.mul(16 * dt);
		const position = this.attachment.WorldPosition.mul(new Vector3(1, 0, 1)).add(
			Vector3.yAxis.mul((height / 2) * 0.74),
		);

		const newPosition = position.add(direction);

		this.attachment.WorldPosition = newPosition;

		if (moveDirection.Magnitude > 0) {
			const invertedMoveDirection = moveDirection.mul(-1);
			const angle = math.deg(math.atan2(invertedMoveDirection.X, invertedMoveDirection.Z));

			this.attachment.WorldOrientation = Vector3.yAxis.mul(angle - 90);
		}
	}
}
