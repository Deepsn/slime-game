import { Service, OnStart, OnInit } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinService";
import { producer } from "server/producers";

@Service()
export class TestService implements OnPlayer {
	onPlayerJoin(player: Player): void {
		producer.changeSlimeStat(tostring(player.UserId), "size", 10);
	}
}
