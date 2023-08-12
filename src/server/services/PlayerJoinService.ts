import { OnStart, Modding, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnPlayer {
	onPlayerAdd?(player: Player): void;
	onPlayerRemove?(player: Player): void;
}

@Service()
class PlayerJoin implements OnStart {
	onStart(): void {
		const listeners = new Set<OnPlayer>();

		Modding.onListenerAdded<OnPlayer>((listener) => listeners.add(listener));
		Modding.onListenerRemoved<OnPlayer>((listener) => listeners.delete(listener));

		Players.PlayerAdded.Connect((player) => {
			for (const listener of listeners) {
				task.spawn(() => listener.onPlayerAdd?.(player));
			}
		});

		Players.PlayerRemoving.Connect((player) => {
			for (const listener of listeners) {
				task.spawn(() => listener.onPlayerRemove?.(player));
			}
		});

		for (const player of Players.GetPlayers()) {
			for (const listener of listeners) {
				task.spawn(() => listener.onPlayerAdd?.(player));
			}
		}
	}
}
