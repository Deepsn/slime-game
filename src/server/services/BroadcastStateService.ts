import { OnStart, Service } from "@flamework/core";
import { createBroadcaster } from "@rbxts/reflex";
import { producer } from "server/producers";
import Remotes from "shared/remotes";
import { slices } from "shared/slices";

@Service({ loadOrder: 5 })
export default class BroadcastStateService implements OnStart {
	onStart(): void | Promise<void> {
		const dispatchRemote = Remotes.Server.Get("dispatch");
		const startRemote = Remotes.Server.Get("start");

		const broadcaster = createBroadcaster({
			producers: slices,
			dispatch: (player, actions) => {
				dispatchRemote.SendToPlayer(player, actions);
			},
		});

		startRemote.Connect((player) => {
			broadcaster.start(player);
		});

		producer.applyMiddleware(broadcaster.middleware);
	}
}
