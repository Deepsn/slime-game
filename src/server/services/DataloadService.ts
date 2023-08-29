import { Service, OnStart } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { PlayerData, defaultPlayerData } from "shared/slices/players";
import { OnPlayer } from "./PlayerJoinService";
import { Logger } from "@rbxts/log";
import { producer } from "server/producers";
import { selectPlayerData } from "shared/selectors";
import { Players } from "@rbxts/services";

@Service()
export class DataLoadService implements OnStart, OnPlayer {
	private profileStore?: ProfileStore<PlayerData>;
	private profiles = new Map<Player, Profile<PlayerData>>();

	constructor(private logger: Logger) {}

	onStart() {
		this.profileStore = ProfileService.GetProfileStore("PlayerProfiles-DEV", defaultPlayerData);
	}

	onPlayerJoin(player: Player): void {
		if (!this.profileStore) {
			this.logger.Warn("Profile store hasn't loaded yet, waiting");

			while (!this.profileStore) {
				task.wait();
			}
		}

		const start_time = os.clock();
		const profile = this.profileStore.LoadProfileAsync(`Player_${player.UserId}`, "ForceLoad");
		const delta_time = os.clock() - start_time;
		const rounded_time = math.round(delta_time * 100) / 100;

		this.logger.Info("{player}'s profile loaded in {time}s", player.Name, rounded_time);

		if (profile !== undefined) {
			profile.AddUserId(player.UserId);
			profile.Reconcile();
			this.logger.Debug("{player} data: {@data}", player.Name, profile.Data);

			const unsubscribe = producer.subscribe(selectPlayerData(tostring(player.UserId)), (data) => {
				if (data) {
					profile.Data = data;
				}
			});

			profile.ListenToRelease(() => {
				unsubscribe();
				this.logger.Info("{player}'s profile has been released, {data}", player.Name, profile.Data);
				this.profiles.delete(player);
				player.Kick();
			});

			if (player.IsDescendantOf(Players)) {
				profile.Data.slime.size = 1;
				profile.Data.balance.coins = 9e9;
				profile.Data.stats.level = defaultPlayerData.stats.level;
				profile.Data.stats.experience = defaultPlayerData.stats.experience;
				profile.Data.stats.maxExperience = defaultPlayerData.stats.maxExperience;

				producer.loadPlayerData(tostring(player.UserId), profile.Data);

				this.profiles.set(player, profile);
			} else {
				profile.Release();
			}
		} else {
			player.Kick();
		}
	}

	onPlayerLeave(player: Player): void {
		const profile = this.profiles.get(player);

		profile?.Release();
	}
}
