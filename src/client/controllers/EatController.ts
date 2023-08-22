import { Controller, OnStart, OnTick } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players } from "@rbxts/services";
import { RootState, producer } from "client/producers";
import { selectPlayerWorlds } from "shared/selectors";
import { Collectable } from "shared/slices/collectables";
import { CrystalsController } from "./CrystalsController";
import { Logger } from "@rbxts/log";
import SlimeSizeController from "./SlimeSizeController";
import Remotes from "shared/remotes";

@Controller()
export class EatController implements OnStart, OnCharacter, OnTick {
	private root?: BasePart;
	private localPlayer = Players.LocalPlayer;
	private collectiblesRemotes = Remotes.Client.GetNamespace("collectibles");
	private currentWorld?: `Area${number}` = undefined;

	constructor(
		private logger: Logger,
		private readonly crystalsController: CrystalsController,
		private readonly slimeSizeController: SlimeSizeController,
	) {}

	onStart(): void {
		producer.subscribe(selectPlayerWorlds(tostring(this.localPlayer.UserId)), (worlds) => {
			if (!worlds) {
				return;
			}

			this.currentWorld = worlds.selected;
		});
	}

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== this.localPlayer) {
			return;
		}

		this.root = character.WaitForChild("Root") as BasePart;
	}

	onTick(dt: number): void {
		if (!this.root) {
			return;
		}

		const origin = this.root.Position;
		const [closest, distance] = this.getClosestBlob(origin);
		// const object =
		// 	closest !== undefined ? this.crystalsController.crystalsContainer.FindFirstChild(closest.id) : undefined;
		const isInside = distance !== undefined && distance < this.slimeSizeController.size / 1.3;
		const collect = this.collectiblesRemotes.Get("collect");

		if (isInside && closest) {
			collect.SendToServer(closest.id);
		}
	}

	getClosestBlob(origin: Vector3) {
		if (this.currentWorld === undefined) {
			return $tuple();
		}

		const selectCrystals = (state: RootState) => {
			return state.collectables.crystals[this.currentWorld!];
		};

		const crystals = producer.getState(selectCrystals);

		if (!crystals) {
			return $tuple();
		}

		let closest: Collectable | undefined = undefined;
		let distance = 10 + this.slimeSizeController.size * 2;

		for (const [, crystal] of pairs(crystals)) {
			const dist = crystal.position.sub(origin).Magnitude;

			if (dist < distance) {
				distance = dist;
				closest = crystal;
			}
		}

		return $tuple(closest, distance);
	}
}
