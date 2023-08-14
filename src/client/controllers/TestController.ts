import { Controller } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinController";
import { OnCharacter } from "./CharacterAddController";

@Controller()
export class TestController implements OnPlayer, OnCharacter {
	onPlayerJoin(player: Player): void {
		warn(`Player ${player.Name} joined`);
	}

	onPlayerLeave(player: Player): void {
		warn(`Player ${player.Name} left`);
	}

	onCharacterAdd(player: Player, character: Model): void {
		warn(`Player ${player.Name} spawned ${character}`);
	}

	onCharacterRemove(player: Player, oldCharacter: Model): void {
		warn(`Player ${player.Name} removed ${oldCharacter}`);
	}
}
