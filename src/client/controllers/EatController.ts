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
import { createSelector } from "@rbxts/reflex";
import { ClientSenderEvent } from "@rbxts/net/out/client/ClientEvent";

@Controller()
export class EatController implements OnStart, OnCharacter, OnTick {
	private root?: BasePart;
	private localPlayer = Players.LocalPlayer;
	private collectiblesRemotes = Remotes.Client.GetNamespace("collectibles");
	private collectRemote?: ClientSenderEvent<[id: string]>;
	private eatPlayerRemote?: ClientSenderEvent<[id: number]>;
	private currentWorld?: `Area${number}` = undefined;

	constructor(
		private logger: Logger,
		private readonly crystalsController: CrystalsController,
		private readonly slimeSizeController: SlimeSizeController,
	) {}

	onStart(): void {
		this.collectRemote = this.collectiblesRemotes.Get("collect");
		this.eatPlayerRemote = Remotes.Client.Get("eatPlayer");

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

		const size = this.slimeSizeController.sizes.get(this.localPlayer.UserId) ?? 0;
		const origin = this.root.Position;
		const [closestBlob, distanceFromBlob] = this.getClosestBlob(origin);
		const [closestPlayer, distanceFromPlayer] = this.getClosestPlayer(origin);
		const minimalSize = size / 1.3;
		const isInsideBlob = distanceFromBlob !== undefined && distanceFromBlob < minimalSize;
		const isInsidePlayer = distanceFromPlayer !== undefined && distanceFromPlayer < minimalSize;

		if (isInsideBlob && closestBlob) {
			this.collectRemote?.SendToServer(closestBlob.id);
		}

		if (isInsidePlayer && closestPlayer) {
			this.eatPlayerRemote?.SendToServer(closestPlayer.UserId);
		}
	}

	getClosestPlayer(origin: Vector3) {
		const players = Players.GetPlayers();

		let closest: Player | undefined = undefined;
		const size = this.slimeSizeController.sizes.get(this.localPlayer.UserId) ?? 0;
		let distance = 10 + size * 2;

		for (const player of players) {
			if (player === this.localPlayer) {
				continue;
			}

			const character = player.Character;

			if (!character) {
				continue;
			}

			const root = character.FindFirstChild("Root") as BasePart | undefined;

			if (!root) {
				continue;
			}

			const dist = root.Position.sub(origin).Magnitude;

			if (dist < distance) {
				distance = dist;
				closest = player;
			}
		}

		return $tuple(closest, distance);
	}

	getClosestBlob(origin: Vector3) {
		if (this.currentWorld === undefined) {
			return $tuple();
		}

		const selectCrystals = (state: RootState) => {
			return state.collectables.crystals[this.currentWorld!];
		};

		const selectCoins = (state: RootState) => {
			return state.collectables.coins[this.currentWorld!];
		};

		const selectCollectibles = createSelector(selectCrystals, selectCoins, (crystals, coins) => {
			return { ...crystals, ...coins };
		});

		const collectables = producer.getState(selectCollectibles);

		if (!collectables) {
			return $tuple();
		}

		let closest: Collectable | undefined = undefined;
		let distance = 10 + (this.slimeSizeController.sizes.get(this.localPlayer.UserId) ?? 0) * 2;

		for (const [, collectable] of pairs(collectables)) {
			const dist = collectable.position.sub(origin).Magnitude;

			if (dist < distance) {
				distance = dist;
				closest = collectable;
			}
		}

		return $tuple(closest, distance);
	}
}
