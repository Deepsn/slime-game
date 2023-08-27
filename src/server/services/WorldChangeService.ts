import { Service, OnStart } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinService";
import { createSelector } from "@rbxts/reflex";
import { selectPlayerStats, selectPlayerWorlds } from "shared/selectors";
import { producer } from "server/producers";
import { worldsLevel } from "shared/lib/worlds";
import { RespawnService } from "./RespawnService";
import { selectPlayerCurrentWorld } from "shared/selectors/players";

@Service()
export class WorldChangeService implements OnPlayer {
	private playerSubscriptions = new Map<Player, () => void>();

	constructor(private readonly respawnService: RespawnService) {}

	onPlayerJoin(player: Player): void {
		const unsubscribe = producer.subscribe(selectPlayerCurrentWorld(tostring(player.UserId)), (area) => {
			if (!area) {
				return false;
			}

			this.respawnService.spawn(player);
		});

		this.playerSubscriptions.set(player, unsubscribe);
	}

	onPlayerLeave(player: Player): void {
		const unsubscribe = this.playerSubscriptions.get(player);
		unsubscribe?.();
		this.playerSubscriptions.delete(player);
	}
}
