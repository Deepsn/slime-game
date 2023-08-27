import Net from "@rbxts/net";
import { BroadcastAction } from "@rbxts/reflex";
import { PlayerUpgrades } from "./slices/players";

const Remotes = Net.Definitions.Create({
	dispatch: Net.Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
	start: Net.Definitions.ClientToServerEvent(),
	collectibles: Net.Definitions.Namespace({
		collect: Net.Definitions.ClientToServerEvent<[id: string]>(),
	}),
	eatPlayer: Net.Definitions.ClientToServerEvent<[id: number]>(),
	buyUpgrade: Net.Definitions.ClientToServerEvent<[upgradeName: keyof PlayerUpgrades]>(),
});

export default Remotes;
