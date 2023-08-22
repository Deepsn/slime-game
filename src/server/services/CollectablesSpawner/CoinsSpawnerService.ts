import { Service, OnStart, OnInit, OnTick } from "@flamework/core";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { CrystalsSpawnerService } from "./CrystalsSpawnerService";
import { producer } from "server/producers";
import { Coin } from "shared/slices/collectables";

@Service()
export class CoinsSpawnerService implements OnStart, OnTick {
	private readonly SPAWN_TICK = 1; // second to spawn
	private readonly initialSpawnAmount = 50;
	private spawnTick = 0;
	private RNG = new Random();

	constructor(private readonly crystalsSpawnerService: CrystalsSpawnerService) {}

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

	spawn() {
		const areaId = this.RNG.NextInteger(1, 5);
		const coinObject = ReplicatedStorage.Crystals.Coin;
		const position = this.crystalsSpawnerService.getSpawnLocation(areaId, coinObject);

		if (!position) {
			task.defer(() => this.spawn());
			return;
		}

		const coin: Coin = {
			id: HttpService.GenerateGUID(false),
			position,
			value: 1,
		};

		producer.addCoin(`Area${areaId}`, coin);
	}
}
