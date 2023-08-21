import { Service, OnStart, OnTick } from "@flamework/core";
import { HttpService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { producer } from "server/producers";
import { Collectable } from "shared/slices/collectables";
import { crystalsValues } from "./utils";

@Service()
export class CrystalsSpawnerService implements OnStart, OnTick {
	private readonly SPAWN_TICK = 1; // second to spawn
	private readonly initialSpawnAmount = 200;
	private spawnTick = 0;
	private RNG = new Random();

	onStart() {
		for (const _ of $range(1, this.initialSpawnAmount)) {
			this.spawn();
		}
	}

	onTick(dt: number): void {
		this.spawnTick += dt;

		if (this.spawnTick > this.SPAWN_TICK) {
			this.spawnTick = 0;
			this.spawn();
		}
	}

	private getValueFromCrystal(crystal: Instance, areaId: number): number {
		return crystalsValues[crystal.Name as never][areaId];
	}

	private getRandomCrystal(): Instance {
		const crystals = ReplicatedStorage.Crystals.GetChildren();
		const choosenCrystal = crystals[this.RNG.NextInteger(1, crystals.size() - 1)];

		return choosenCrystal.Name !== "Coin" ? choosenCrystal : this.getRandomCrystal();
	}

	private getSpawnLocation(areaId: number) {
		const map = Workspace.FindFirstChild(`Map ${areaId}`);
		const spawnPart = map?.FindFirstChild("Spawn") as Part | undefined;

		if (!spawnPart) {
			return;
		}

		const direction = this.RNG.NextUnitVector();
		const sizeX = spawnPart.Size.X;
		const sizeZ = spawnPart.Size.Z;
		const distance = new Vector3(this.RNG.NextInteger(-sizeX, sizeX), 0, this.RNG.NextInteger(-sizeZ, sizeZ));

		return direction.mul(distance);
	}

	spawn() {
		const areaId = this.RNG.NextInteger(1, 5);
		const position = this.getSpawnLocation(areaId);

		if (!position) {
			task.defer(() => this.spawn());
			return;
		}

		const randomCrystal = this.getRandomCrystal();
		const crystal: Collectable = {
			id: HttpService.GenerateGUID(false),
			color: randomCrystal.Name,
			position,
			value: this.getValueFromCrystal(randomCrystal, areaId),
		};

		producer.addCrystal(`Area${areaId}`, crystal);
	}
}
