import { OnInit, Service } from "@flamework/core";
import { createBroadcaster } from "@rbxts/reflex";
import { producer } from "server/producers";
import Remotes from "shared/remotes";
import { slices } from "shared/slices";

@Service()
export default class BroadcastStateService implements OnInit {
	private broadcaster = createBroadcaster({
		producers: slices,
		dispatch: (player, actions) => {
			Remotes.Server.Get("dispatch").SendToPlayer(player, actions);
		},
	});

	onInit(): void | Promise<void> {
		Remotes.Server.Get("start").Connect((player) => {
			this.broadcaster.start(player);
		});

		producer.applyMiddleware(this.broadcaster.middleware);
	}
}
