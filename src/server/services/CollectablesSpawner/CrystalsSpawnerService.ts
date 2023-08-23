import { Service, OnStart, OnTick } from "@flamework/core";
import { HttpService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { producer } from "server/producers";
import { Crystal } from "shared/slices/collectables";
import { crystalsValues } from "./utils";
import { t } from "@rbxts/t";

@Service()
export class CrystalsSpawnerService implements OnStart, OnTick {
	private readonly SPAWN_TICK = 1; // second to spawn
	private readonly initialSpawnAmount = 150;
	private crystalChance: { name: string; chance: number }[] = [];
	private spawnTick = 0;
	private totalSpawnChance = 0;
	private RNG = new Random();

	onStart() {
		for (const _ of $range(1, this.initialSpawnAmount)) {
			this.spawn();
		}

		for (const [crystalName, crystal] of pairs(crystalsValues)) {
			this.totalSpawnChance += crystal.SpawnChance;
			this.crystalChance.push({
				name: crystalName,
				chance: crystal.SpawnChance,
			});
		}

		this.crystalChance.sort((a, b) => a.chance < b.chance);
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

	private getRandomCrystal() {
		const chanceNumber = this.RNG.NextInteger(0, this.totalSpawnChance);

		for (const crystal of this.crystalChance) {
			if (chanceNumber <= crystal.chance) {
				const crystalObject = ReplicatedStorage.Crystals.FindFirstChild(crystal.name) as MeshPart;

				if (!crystalObject) {
					continue;
				}

				return crystalObject;
			}
		}
	}

	getSpawnLocation(areaId: number, crystal: BasePart | Model) {
		const map = Workspace.FindFirstChild(`Map ${areaId}`);
		const spawnPart = map?.FindFirstChild("Spawn") as Part | undefined;

		if (!spawnPart) {
			return;
		}

		const direction = this.RNG.NextUnitVector();
		const sizeX = spawnPart.Size.X / 2;
		const sizeZ = spawnPart.Size.Z / 2;
		const distance = new Vector3(this.RNG.NextInteger(-sizeX, sizeX), 0, this.RNG.NextInteger(-sizeZ, sizeZ));
		const height = t.instanceIsA("Model")(crystal) ? crystal.GetExtentsSize().Y : crystal.Size.Y;

		return spawnPart.Position.add(direction.mul(distance).add(Vector3.yAxis.mul(0.3 + height / 2)));
	}

	spawn() {
		const areaId = this.RNG.NextInteger(1, 5);
		const randomCrystal = this.getRandomCrystal();

		if (!randomCrystal) {
			task.defer(() => this.spawn());
			return;
		}

		const position = this.getSpawnLocation(areaId, randomCrystal);

		if (!position) {
			task.defer(() => this.spawn());
			return;
		}

		const crystal: Crystal = {
			id: HttpService.GenerateGUID(false),
			color: randomCrystal.Name,
			position,
			value: this.getValueFromCrystal(randomCrystal, areaId),
		};

		producer.addCrystal(`Area${areaId}`, crystal);
	}
}
