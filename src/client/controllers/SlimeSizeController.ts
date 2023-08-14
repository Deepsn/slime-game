import { Controller } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { TweenService } from "@rbxts/services";

@Controller()
export default class SlimeSizeController implements OnCharacter {
	public size = 0;
	private tweenInfo = new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0);

	onCharacterAdd(player: Player, character: Model): void {
		const leaderstats = player.WaitForChild("leaderstats") as Leaderstats;
		const characterMesh = character.WaitForChild("Mesh") as MeshPart;
		const tweenInfo = this.tweenInfo;

		const update = () => {
			this.size = leaderstats.Size.Value;

			const goalSize = Vector3.one.mul(new Vector3(1, 0.74, 1)).mul(this.size);
			const tween = TweenService.Create(characterMesh, tweenInfo, { Size: goalSize });

			tween.Play();
		};

		leaderstats.Size.GetPropertyChangedSignal("Value").Connect(update);
		update();
	}
}
