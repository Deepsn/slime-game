import { Controller, OnStart } from "@flamework/core";
import { createBroadcastReceiver } from "@rbxts/reflex";
import { producer } from "client/producers";
import Remotes from "shared/remotes";

@Controller()
export default class BroadcastStateController implements OnStart {
	private receiver = createBroadcastReceiver({
		start: () => {
			Remotes.Client.Get("start").SendToServer();
		},
	});

	onStart(): void | Promise<void> {
		Remotes.Client.Get("dispatch").Connect((actions) => {
			this.receiver.dispatch(actions);
		});

		producer.applyMiddleware(this.receiver.middleware);
	}
}
