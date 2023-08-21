import { createBroadcastReceiver, loggerMiddleware } from "@rbxts/reflex";
import { producer } from "client/producers";
import Remotes from "shared/remotes";

const dispatchRemote = Remotes.Client.Get("dispatch");
const startRemote = Remotes.Client.Get("start");

export default function StartReceiving() {
	const receiver = createBroadcastReceiver({
		start: () => {
			startRemote.SendToServer();
		},
	});
	dispatchRemote.Connect((actions) => {
		receiver.dispatch(actions);
	});

	producer.applyMiddleware(receiver.middleware);
}
