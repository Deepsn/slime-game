import { Controller, OnRender, OnInit } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players, Workspace } from "@rbxts/services";
import { Logger } from "@rbxts/log";

@Controller()
export default class MovementController implements OnInit, OnRender, OnCharacter {
	private attachment?: Attachment;
	private localPlayer = Players.LocalPlayer;
	private controls?: Controls;
	private camera = Workspace.CurrentCamera!;
	private height = 0;

	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		const playerScripts = this.localPlayer.WaitForChild("PlayerScripts") as Folder;
		const playerModule = require(playerScripts.WaitForChild("PlayerModule") as ModuleScript) as PlayerModule;

		this.controls = playerModule.GetControls();
	}

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== this.localPlayer) {
			return;
		}

		const alignPosition = new Instance("AlignPosition");
		const mainAttachment = new Instance("Attachment");
		const otherAttachment = new Instance("Attachment");
		const root = character.WaitForChild("Root");
		const mesh = character.WaitForChild("Mesh") as MeshPart;

		this.height = mesh.Size.Y / 2;

		mainAttachment.Name = "MainAttachment";
		otherAttachment.Name = "OtherAttachment";

		alignPosition.Attachment0 = otherAttachment;
		alignPosition.Attachment1 = mainAttachment;

		alignPosition.ApplyAtCenterOfMass = true;
		alignPosition.Responsiveness = 20;
		alignPosition.MaxForce = 2e6;

		mainAttachment.Parent = Workspace.Terrain;
		otherAttachment.Parent = root;
		alignPosition.Parent = character;

		this.attachment = mainAttachment;
	}

	getLocalDirection() {
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

		const direction = this.getLocalDirection().mul(16 * dt);
		const position = this.attachment.WorldPosition.mul(new Vector3(1, 0, 1)).add(Vector3.yAxis.mul(this.height));

		const newPosition = position.add(direction); // 16 is speed

		this.attachment.WorldPosition = newPosition;

		this.logger.Info("Movement speed {diff}", newPosition.sub(position).Magnitude);
	}
}
