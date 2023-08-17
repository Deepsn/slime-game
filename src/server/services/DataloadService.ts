import { Service, OnStart } from "@flamework/core";
import { PlayerData, defaultPlayerData } from "shared/slices/players";
import { OnPlayer } from "./PlayerJoinService";
import { Logger } from "@rbxts/log";
import { producer } from "server/producers";
import { selectPlayerData } from "shared/selectors";
import { Janitor } from "@rbxts/janitor";
import { Collection, Document, createCollection } from "@rbxts/lapis";
import { validate } from "server/lib/validate";
import { Players } from "@rbxts/services";

@Service()
export class DataLoadService implements OnStart, OnPlayer {
	private collection?: Collection<PlayerData>;
	private documents = new Map<Player, [Janitor, Document<PlayerData>?]>();

	constructor(private logger: Logger) {}

	onStart() {
		this.collection = createCollection<PlayerData>("PlayerData", {
			defaultData: defaultPlayerData,
			validate,
		});
	}

	onPlayerJoin(player: Player): void {
		if (player.UserId < 0) {
			return this.loadDefaultData(player);
		}

		if (!this.collection) {
			this.logger.Warn("Lapis Collection hasn't loaded yet, waiting...");

			while (!this.collection) {
				task.wait();
			}
		}

		try {
			const start_time = os.clock();
			this.loadPlayerData(player, true);
			const delta_time = os.clock() - start_time;
			const rounded_time = math.round(delta_time * 100) / 100;

			this.logger.Info("{player}'s document loaded in {time}s", player.Name, rounded_time);
		} catch (error) {
			player.Kick("Failed to load your data, rejoin");
			this.logger.Fatal("Failed to load {player} document, {@error}", player.Name, error);
		}
	}

	async onPlayerLeave(player: Player) {
		const documentObject = this.documents.get(player);

		if (documentObject) {
			const [janitor, document] = documentObject;

			await document?.close();
			janitor.Destroy();
			this.documents.delete(player);
		}
	}

	loadDefaultData(player: Player) {
		producer.loadPlayerData(tostring(player.UserId), defaultPlayerData);
	}

	async loadPlayerData(player: Player, mock: boolean) {
		const document = await this.collection
			?.load(`Player_${player.UserId}`)
			.timeout(5)
			.catch(() => undefined);

		if (!document && !mock) {
			return player.Kick("Failed to load data");
		}

		if (!player.IsDescendantOf(Players)) {
			return;
		}

		const playerData = !mock ? document?.read() : defaultPlayerData;

		if (!playerData) {
			return player.Kick("Failed to load data");
		}

		const playerKey = tostring(player.UserId);
		const janitor = new Janitor();

		this.logger.Debug("{player} data: {@data}", player.Name, playerData);

		const unsubscribe = producer.subscribe(selectPlayerData(playerKey), (data) => {
			if (data) {
				document?.write(data);
			}
		});

		janitor.Add(unsubscribe);

		this.documents.set(player, [janitor, document]);

		producer.loadPlayerData(playerKey, playerData);
	}
}
