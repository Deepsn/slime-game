import { Controller, OnRender, OnStart } from "@flamework/core";
import { OnCharacter } from "./CharacterAddController";
import { Players } from "@rbxts/services";
import { CrystalsController } from "./CrystalsController";
import { CoinsController } from "./CoinsController";
import SlimeSizeController from "./SlimeSizeController";
import { producer } from "client/producers";
import { WorldController } from "./WorldController";
import { Collectable } from "shared/slices/collectables";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { selectPlayerUpgrades } from "shared/selectors";
import MovementController from "./MovementController";

@Controller()
export class MagnetController implements OnStart, OnRender, OnCharacter {
	public currentCollectible?: Collectable = undefined;

	private MAGNET_FORCE = 3;
	private MAGNET_DISTANCE = 5;
	private root?: Part;
	private localPlayer = Players.LocalPlayer;

	constructor(
		private logger: Logger,
		private readonly crystalsController: CrystalsController,
		private readonly coinsController: CoinsController,
		private readonly slimeSizeController: SlimeSizeController,
		private readonly worldController: WorldController,
		private readonly movementController: MovementController,
	) {}

	onStart() {
		const selectMagnetUpgrade = (playerId: string) => {
			return createSelector(selectPlayerUpgrades(playerId), (upgrades) => {
				return upgrades?.magnet;
			});
		};

		producer.subscribe(selectMagnetUpgrade(tostring(this.localPlayer.UserId)), (magnetLevel) => {
			if (!magnetLevel) {
				return;
			}

			this.MAGNET_FORCE = 3 + magnetLevel;
			this.MAGNET_DISTANCE = 5 + magnetLevel / 2;
		});
	}

	onCharacterAdd(player: Player, character: Model): void {
		if (player !== this.localPlayer) {
			return;
		}

		this.root = character.WaitForChild("Root") as Part;
	}

	onRender(dt: number): void {
		if (!this.root) {
			return;
		}

		const origin = this.root.Position;
		const [closestBlob] = this.getClosestBlob(origin);

		const playerArea = this.worldController.currentWorld;

		if (!playerArea) {
			return;
		}

		if (this.currentCollectible && this.currentCollectible.id !== closestBlob?.id) {
			producer.setCrystalPosition(
				playerArea,
				this.currentCollectible.id,
				this.currentCollectible.originalPosition ?? this.currentCollectible.position,
			);
			this.currentCollectible = undefined;
		}

		if (!closestBlob) {
			return;
		}

		this.currentCollectible = closestBlob;

		const newBlobPosition = closestBlob.position.Lerp(
			origin.add(this.movementController.direction),
			this.MAGNET_FORCE * dt,
		);

		producer.setCrystalPosition(playerArea, closestBlob.id, newBlobPosition);
	}

	getClosestBlob(origin: Vector3) {
		if (!this.worldController.currentWorld) {
			return $tuple();
		}

		const size = this.slimeSizeController.sizes.get(this.localPlayer.UserId) ?? 0;
		let distance = this.MAGNET_DISTANCE + size;
		let closest: Collectable | undefined = undefined;

		for (const collectible of [...this.crystalsController.crystals]) {
			if (!collectible.type) {
				continue;
			}

			const collectiblePosition = collectible.originalPosition ?? collectible.position;

			const dist = collectiblePosition.sub(origin).Magnitude;

			if (dist < distance) {
				closest = collectible;
				distance = dist;
			}
		}

		return $tuple(closest, distance);
	}
}
