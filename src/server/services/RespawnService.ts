import { Service, OnStart } from "@flamework/core";
import { producer } from "server/producers";
import { selectPlayerWorlds } from "shared/selectors";
import { Players, Workspace } from "@rbxts/services";
import { Logger } from "@rbxts/log";
import { OnCharacter } from "./CharacterAddService";

@Service()
export class RespawnService implements OnStart, OnCharacter {
	private worlds = new Map<string, Folder>();
	private RNG = new Random();

	constructor(private logger: Logger) {}

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
	}

	getRespawnLocation(player: Player) {
		const worlds = producer.getState(selectPlayerWorlds(tostring(player.UserId)));

		if (!worlds) {
			return;
		}

		const world = worlds.selected;
		const worldFolder = this.worlds.get(world);

		if (!worldFolder) {
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
			task.defer(() => this.onCharacterAdd(player, character));
			return;
		}

		character.PivotTo(new CFrame(respawnLocation));
	}
}
