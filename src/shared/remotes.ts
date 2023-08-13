import Net from "@rbxts/net";
import { BroadcastAction } from "@rbxts/reflex";

const Remotes = Net.Definitions.Create({
	dispatch: Net.Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
	start: Net.Definitions.ClientToServerEvent(),
});

export default Remotes;
