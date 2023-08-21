import { Controller, OnStart } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { TweenService } from "@rbxts/services";
import { producer } from "client/producers";
import { selectPlayerSlime } from "shared/selectors";
import { Janitor } from "@rbxts/janitor";

@Controller()
export default class SlimeSizeController implements OnCharacter {
	public size = 0;
	private janitors = new Map<Player, Janitor>();
	private tweenInfo = new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0);

	onCharacterAdd(player: Player, character: Model): void {
		const characterMesh = character.WaitForChild("Mesh") as MeshPart;
		const janitor = new Janitor();

		const update = (size: number) => {
			this.size = size;

			const goalSize = Vector3.one.mul(new Vector3(1, 0.74, 1)).mul(size);
			const tween = TweenService.Create(characterMesh, this.tweenInfo, { Size: goalSize });

			tween.Play();
		};

		const unsubscribe = producer.subscribe(selectPlayerSlime(tostring(player.UserId)), (slime) => {
			if (slime) {
				update(slime.size);
			}
		});

		janitor.Add(unsubscribe);
		this.janitors.set(player, janitor);
	}

	onCharacterRemove(player: Player, oldCharacter: Model): void {
		this.janitors.get(player)?.Destroy();
		this.janitors.delete(player);
	}
}
