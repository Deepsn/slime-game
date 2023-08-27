import { Controller, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { producer } from "client/producers";
import { selectPlayerCurrentWorld } from "shared/selectors/players";

@Controller()
export class WorldController implements OnStart {
	public currentWorld?: `Area${number}` = undefined;
	public currentWorldId?: number;
	public currentMapFolder?: Folder = undefined;
	private localPlayer = Players.LocalPlayer;

	onStart() {
		producer.subscribe(selectPlayerCurrentWorld(tostring(this.localPlayer.UserId)), (selected) => {
			if (!selected) {
				return;
			}

			this.currentWorld = selected;
			this.currentWorldId = tonumber(this.currentWorld.match("%d")[0]);
			this.currentMapFolder = Workspace.FindFirstChild(`Map ${this.currentWorldId}`) as Folder | undefined;
		});
	}
}
