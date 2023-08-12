import { OnInit, OnStart, Controller } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players, Workspace } from "@rbxts/services";

@Controller()
export default class CameraController implements OnCharacter {
	private camera = Workspace.CurrentCamera!;

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== Players.LocalPlayer) {
			return;
		}

		const root = character.WaitForChild("Root", 10) as BasePart | undefined;

		if (root) {
			this.camera.CameraType = Enum.CameraType.Follow;
			this.camera.CameraSubject = root;
		}
	}
}
