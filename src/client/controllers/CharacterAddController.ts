import { Modding, Controller, OnInit } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinController";
import { Logger } from "@rbxts/log";

export interface OnCharacter {
	onCharacterAdd?(player: Player, character: Model): void;
	onCharacterRemove?(player: Player, oldCharacter: Model): void;
}

@Controller()
class CharacterAdd implements OnInit, OnPlayer {
	private listeners = new Set<OnCharacter>();

	constructor(private logger: Logger) {}

	onInit(): void {
		Modding.onListenerAdded<OnCharacter>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnCharacter>((listener) => this.listeners.delete(listener));
	}

	onPlayerJoin(player: Player): void {
		player.CharacterAdded.Connect((character) => this.onCharacterAdd(player, character));
		player.CharacterRemoving.Connect((character) => this.onCharacterRemove(player, character));

		if (player.Character) {
			this.onCharacterAdd(player, player.Character);
		}
	}

	onCharacterAdd(player: Player, character: Model) {
		this.logger.Warn(
			"Player {@player}, character added {@character}, firing to {@listeners} listeners",
			player,
			character,
			this.listeners.size(),
		);

		for (const listener of this.listeners) {
			task.spawn(() => listener.onCharacterAdd?.(player, character));
		}
	}

	onCharacterRemove(player: Player, character: Model) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onCharacterRemove?.(player, character));
		}
	}
}
