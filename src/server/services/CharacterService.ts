import { OnInit, Service } from "@flamework/core";
import { HttpService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { OnPlayer } from "./PlayerJoinService";
import { producer } from "server/producers";
import { Slime } from "shared/slices/slimes";

@Service()
export default class CharacterService implements OnInit, OnPlayer {
	private charactersFolder = new Instance("Folder");

	onInit(): void | Promise<void> {
		this.charactersFolder.Name = "Characters";
		this.charactersFolder.Parent = Workspace;
	}

	onPlayerAdd(player: Player): void {
		const characterModel = new Instance("Model");
		const characterMesh = ReplicatedStorage.assets.PlayerMesh.Clone();

		const root = new Instance("Part");
		const rootWeld = new Instance("WeldConstraint");

		characterMesh.PivotTo(root.CFrame);

		rootWeld.Part0 = root;
		rootWeld.Part1 = characterMesh;

		root.Size = Vector3.one;
		root.Transparency = 1;
		root.CanQuery = false;
		root.CanCollide = true;
		root.Massless = true;
		root.Name = "Root";

		characterMesh.Massless = true;
		characterMesh.CanCollide = false;
		characterMesh.CanQuery = true;
		characterMesh.Anchored = false;
		characterMesh.Name = "Mesh";

		rootWeld.Parent = characterModel;
		root.Parent = characterModel;
		characterMesh.Parent = characterModel;

		characterModel.PrimaryPart = root;
		characterModel.Name = "Character";
		characterModel.Parent = this.charactersFolder;

		characterMesh.SetNetworkOwner(player);

		const slime = {
			id: HttpService.GenerateGUID(false),
			size: 1,
			instance: characterModel,
		} satisfies Slime;

		producer.addSlime(slime);

		player.Character = characterModel;
	}
}
