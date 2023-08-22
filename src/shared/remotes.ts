import Net from "@rbxts/net";
import { BroadcastAction } from "@rbxts/reflex";

const Remotes = Net.Definitions.Create({
	dispatch: Net.Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
	start: Net.Definitions.ClientToServerEvent(),
	collectibles: Net.Definitions.Namespace({
		collect: Net.Definitions.ClientToServerEvent<[id: string]>(),
	}),
});

export default Remotes;
