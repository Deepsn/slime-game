import { Modding, OnInit, Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";

export interface OnPlayer {
	onPlayerJoin?(player: Player): void;
	onPlayerLeave?(player: Player): void;
}

@Controller()
class PlayerJoin implements OnInit, OnStart {
	private listeners = new Set<OnPlayer>();

	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		Modding.onListenerAdded<OnPlayer>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnPlayer>((listener) => this.listeners.delete(listener));
	}

	onStart() {
		Players.PlayerAdded.Connect((player) => this.onPlayerJoin(player));
		Players.PlayerRemoving.Connect((player) => this.onPlayerLeave(player));

		for (const player of Players.GetPlayers()) {
			task.spawn(() => this.onPlayerJoin(player));
		}
	}

	onPlayerJoin(player: Player) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onPlayerJoin?.(player));
		}
	}

	onPlayerLeave(player: Player) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onPlayerLeave?.(player));
		}
	}
}
