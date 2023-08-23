import { Service, OnStart } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { PlayerData, defaultPlayerData } from "shared/slices/players";
import { OnPlayer } from "./PlayerJoinService";
import { Logger } from "@rbxts/log";
import { producer } from "server/producers";
import { selectPlayerData } from "shared/selectors";
import { Janitor } from "@rbxts/janitor";

@Service()
export class DataLoadService implements OnStart, OnPlayer {
	private profileStore?: ProfileStore<PlayerData>;
	private profiles = new Map<Player, [Janitor, Profile<PlayerData>]>();

	constructor(private logger: Logger) {}

	onStart() {
		this.profileStore = ProfileService.GetProfileStore("PlayerProfiles-DEV", defaultPlayerData);
	}

	onPlayerJoin(player: Player): void {
		if (this.profileStore === undefined) {
			this.logger.Warn("Profile store hasn't loaded yet, waiting");

			while (this.profileStore === undefined) {
				task.wait();
			}
		}

		const start_time = os.clock();
		const profile = this.profileStore.LoadProfileAsync(`Player_${player.UserId}`, "ForceLoad");
		const delta_time = os.clock() - start_time;
		const rounded_time = math.round(delta_time * 100) / 100;

		this.logger.Info("{player}'s profile loaded in {time}s", player.Name, rounded_time);

		if (profile !== undefined) {
			const janitor = new Janitor();

			this.logger.Debug("{player} data: {@data}", player.Name, profile.Data);

			const unsubscribe = producer.subscribe(selectPlayerData(tostring(player.UserId)), (data) => {
				if (data) {
					profile.Data = data;
				}
			});

			janitor.Add(unsubscribe);

			producer.loadPlayerData(tostring(player.UserId), profile.Data);

			producer.setSlimeStat(tostring(player.UserId), "size", 1);

			this.profiles.set(player, [janitor, profile]);
		} else {
			player.Kick();
		}
	}

	onPlayerLeave(player: Player): void {
		const profileObject = this.profiles.get(player);

		if (profileObject) {
			const [janitor, profile] = profileObject;

			profile.Release();
			janitor.Destroy();
			this.profiles.delete(player);
		}
	}
}
