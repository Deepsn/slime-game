import { Service, OnStart } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinService";
import { RootState, producer } from "server/producers";

@Service()
export class PlayerAreaService implements OnPlayer {
	onPlayerJoin(player: Player): void {
		const selectPlayerWorld = (state: RootState) => {
			return state.players.worlds[player.UserId];
		};

		producer.subscribe(selectPlayerWorld, (world) => {
			if (world?.selected === undefined) {
				producer.setSelectedWorld(player.UserId, "Area1");
			}
		});
	}
}
