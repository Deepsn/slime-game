import { Controller } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { ReplicatedStorage } from "@rbxts/services";

@Controller()
export default class OverheadController implements OnCharacter {
	onCharacterAdd(player: Player, character: Model): void {
		const root = character.WaitForChild("Root");
		const overheadGui = ReplicatedStorage.assets.Overhead.Clone();

		overheadGui.SetAttribute("owner", player.UserId);

		overheadGui.Parent = root;
		overheadGui.AddTag("Overhead");
	}
}
