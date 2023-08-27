import { Service, OnStart } from "@flamework/core";
import { producer } from "server/producers";
import { selectPlayerWorlds } from "shared/selectors";
import { Players, Workspace } from "@rbxts/services";
import { Logger } from "@rbxts/log";
import { OnCharacter } from "./CharacterAddService";
import CharacterService from "./CharacterService";
import { selectPlayerCurrentWorld } from "shared/selectors/players";
import { WorldService } from "./WorldService";

@Service()
export class RespawnService implements OnStart, OnCharacter {
	private worlds = new Map<string, Folder>();
	private RNG = new Random();

	constructor(
		private logger: Logger,
		private readonly characterService: CharacterService,
		private readonly worldService: WorldService,
	) {}

	onStart(): void {
		const findWorld = (worldIndex: number) => {
			const world = Workspace.FindFirstChild(`Map ${worldIndex}`);

			if (!world || !world.IsA("Folder")) {
				return;
			}

			this.worlds.set(`Area${worldIndex}`, world);

			findWorld(worldIndex + 1);
		};

		findWorld(1);
	}

	onCharacterAdd(player: Player, character: Model): void {
		task.delay(0.1, () => this.spawn(player));

		const connection = character.AncestryChanged.Connect((_, parent) => {
			if (parent !== undefined || !player.Character) {
				print("not destroying");
				return;
			}

			player.Character = undefined;
			connection.Disconnect();

			task.wait(0.2);

			if (player.IsDescendantOf(Players)) {
				this.characterService.onPlayerJoin(player);
			}
		});
	}

	getRespawnLocation(player: Player) {
		const world = this.worldService.waitFor(player); //producer.getState(selectPlayerCurrentWorld(tostring(player.UserId)));

		if (!world || !world.selected) {
			this.logger.Warn("Player has no world");
			return;
		}

		const worldFolder = this.worlds.get(world.selected);

		if (!worldFolder) {
			this.logger.Warn("World folder not found");
			return;
		}

		const spawnObject = worldFolder.FindFirstChild("Spawn") as BasePart;

		if (!spawnObject) {
			this.logger.Warn("Spawn object not found in world");
			return;
		}

		const size = spawnObject.Size;
		const getRandomPoint = () => {
			const x = this.RNG.NextInteger(-size.X / 2, size.X / 2);
			const z = this.RNG.NextInteger(-size.Z / 2, size.Z / 2);

			return spawnObject.Position.add(new Vector3(x, 0, z));
		};

		const checkOccupied = (point: Vector3) => {
			// check other players
			for (const player of Players.GetPlayers()) {
				if (player.Character) {
					const root = player.Character.FindFirstChild("Root") as BasePart;
					const mesh = player.Character.FindFirstChild("Mesh") as BasePart;

					if (root && mesh) {
						const distance = root.Position.sub(point).Magnitude - mesh.Size.Magnitude;

						if (distance < 10) {
							return true;
						}
					}
				}
			}

			return false;
		};

		const getSpawnPoint = (): Vector3 => {
			const point = getRandomPoint();

			if (checkOccupied(point)) {
				return getSpawnPoint();
			}

			return point;
		};

		return getSpawnPoint();
	}

	spawn(player: Player, location?: Vector3) {
		const character = player.Character;

		if (!character) {
			return;
		}

		const respawnLocation = location ?? this.getRespawnLocation(player);

		if (!respawnLocation) {
			task.defer(() => this.spawn(player));
			return;
		}

		producer.setStats(tostring(player.UserId), "forcefield", true);
		character.PivotTo(new CFrame(respawnLocation));

		task.delay(30, () => {
			if (!player.IsDescendantOf(Players)) {
				return;
			}

			producer.setStats(tostring(player.UserId), "forcefield", false);
		});
	}
}
