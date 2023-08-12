import { OnStart, Modding, Service } from "@flamework/core";
import { OnPlayer } from "./PlayerJoinService";

export interface OnCharacter {
	onCharacterAdd?(player: Player, character: Model & Player["Character"]): void;
	onCharacterRemove?(player: Player, oldCharacter: Model & Player["Character"]): void;
}

@Service()
class CharacterAdd implements OnStart, OnPlayer {
	private listeners = new Set<OnCharacter>();

	onStart(): void {
		Modding.onListenerAdded<OnCharacter>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnCharacter>((listener) => this.listeners.delete(listener));
	}

	onPlayerAdd(player: Player): void {
		player.CharacterAdded.Connect((character) => {
			for (const listener of this.listeners) {
				task.spawn(() => listener.onCharacterAdd?.(player, character));
			}
		});

		player.CharacterRemoving.Connect((character) => {
			for (const listener of this.listeners) {
				task.spawn(() => listener.onCharacterRemove?.(player, character));
			}
		});

		if (player.Character) {
			for (const listener of this.listeners) {
				task.spawn(() => listener.onCharacterAdd?.(player, player.Character!));
			}
		}
	}
}
