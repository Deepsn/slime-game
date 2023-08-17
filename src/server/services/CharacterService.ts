import { OnInit, Service } from "@flamework/core";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { OnPlayer } from "./PlayerJoinService";

@Service()
export default class CharacterService implements OnInit, OnPlayer {
	private charactersFolder = new Instance("Folder");

	onInit(): void | Promise<void> {
		this.charactersFolder.Name = "Characters";
		this.charactersFolder.Parent = Workspace;
	}

	onPlayerJoin(player: Player): void {
		const characterModel = new Instance("Model");
		const characterMesh = ReplicatedStorage.assets.PlayerMesh.Clone();

		const root = new Instance("Part");
		const rootWeld = new Instance("WeldConstraint");

		const alignOrientation = new Instance("AlignOrientation");
		const alignPosition = new Instance("AlignPosition");

		characterMesh.PivotTo(root.CFrame);

		rootWeld.Part0 = root;
		rootWeld.Part1 = characterMesh;

		root.Size = Vector3.one;
		root.Transparency = 1;
		root.CanQuery = false;
		root.CanCollide = true;
		root.Massless = false;
		root.Name = "Root";

		characterMesh.Massless = true;
		characterMesh.CanCollide = false;
		characterMesh.CanQuery = true;
		characterMesh.Anchored = false;
		characterMesh.Name = "Mesh";

		alignPosition.ApplyAtCenterOfMass = true;
		alignPosition.Responsiveness = 20;
		alignPosition.MaxForce = 2e6;

		alignOrientation.Responsiveness = 20;
		alignOrientation.MaxTorque = 2e6;

		alignOrientation.Parent = characterModel;
		alignPosition.Parent = characterModel;

		rootWeld.Parent = characterModel;
		root.Parent = characterModel;
		characterMesh.Parent = characterModel;

		characterModel.PrimaryPart = root;
		characterModel.Name = "Character";
		characterModel.Parent = this.charactersFolder;

		characterMesh.SetNetworkOwner(player);

		// const slime = {
		// 	id: HttpService.GenerateGUID(false),
		// 	size: 1,
		// 	instance: characterModel,
		// } satisfies Slime;

		// producer.addSlime(slime);

		player.Character = characterModel;
	}
}
