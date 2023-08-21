import { Controller, OnStart } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players, TweenService } from "@rbxts/services";
import { RootState, producer } from "client/producers";
import { selectPlayerSlime } from "shared/selectors";
import { Janitor } from "@rbxts/janitor";

@Controller()
export default class SlimeSizeController implements OnStart {
	public size = 0;
	private janitors = new Map<Player, Janitor>();
	private tweenInfo = new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out, 0, false, 0);

	onStart(): void {
		const selectSlimes = (state: RootState) => {
			return state.players.slime;
		};

		producer.observe(selectSlimes, (slime, id) => {
			const player = Players.GetPlayerByUserId(id);
			const janitor = new Janitor();

			if (!player) {
				return;
			}

			const onCharacterAdd = (character: Model) => {
				const characterMesh = character.WaitForChild("Mesh") as MeshPart;

				const update = (size: number) => {
					this.size = size;

					const goalSize = Vector3.one.mul(new Vector3(1, 0.74, 1)).mul(size);
					const tween = TweenService.Create(characterMesh, this.tweenInfo, { Size: goalSize });

					tween.Play();
				};

				const selectPlayerSlime = (state: RootState) => {
					return state.players.slime[id];
				};

				janitor.Add(
					producer.subscribe(selectPlayerSlime, (slime) => {
						if (slime) {
							update(slime.size);
						}
					}),
				);
				update(slime.size);
			};

			janitor.Add(player.CharacterAdded.Connect((character) => onCharacterAdd(character)));
			if (player.Character) {
				onCharacterAdd(player.Character);
			}

			return () => {
				janitor.Destroy();
			};
		});
	}

	// onCharacterAdd(player: Player, character: Model): void {
	// 	print("character added");
	// 	const characterMesh = character.WaitForChild("Mesh") as MeshPart;

	// 	const update = (size: number) => {
	// 		this.size = size;

	// 		const goalSize = Vector3.one.mul(new Vector3(1, 0.74, 1)).mul(size);
	// 		const tween = TweenService.Create(characterMesh, this.tweenInfo, { Size: goalSize });

	// 		tween.Play();
	// 	};

	// 	const selectPlayerSlime = (id: number) => {
	// 		return (state: RootState) => {
	// 			return state.players.slime[id];
	// 		};
	// 	};

	// 	producer.subscribe(selectPlayerSlime(player.UserId), (slime) => {
	// 		print("player slime", slime);
	// 	});

	// 	// janitor.Add(unsubscribe);
	// 	janitor.Add(() => print("character removed"));

	// 	this.janitors.set(player, janitor);
	// }
}
