import { Service } from "@flamework/core";
import { PlayerWorlds } from "shared/slices/players";
import { OnPlayer } from "./PlayerJoinService";
import { producer } from "server/producers";
import { selectPlayerWorlds } from "shared/selectors";

@Service()
export class WorldService implements OnPlayer {
	public playerWorlds = new Map<Player, PlayerWorlds>();
	private playerSubscriptions = new Map<Player, () => void>();

	onPlayerJoin(player: Player): void {
		const unsubscribe = producer.subscribe(selectPlayerWorlds(tostring(player.UserId)), (world) => {
			if (!world) {
				return;
			}

			this.playerWorlds.set(player, world);
		});

		this.playerSubscriptions.set(player, unsubscribe);
	}

	onPlayerLeave(player: Player): void {
		this.playerSubscriptions.get(player)?.();

		this.playerWorlds.delete(player);
		this.playerSubscriptions.delete(player);
	}

	waitFor(player: Player) {
		if (!this.playerWorlds.get(player)) {
			while (!this.playerWorlds.get(player)) {
				task.wait();
			}
		}
		return this.playerWorlds.get(player);
	}
}
