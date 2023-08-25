import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { producer } from "client/producers";
import { selectPlayerWorlds } from "shared/selectors";

@Controller()
export class WorldController implements OnStart {
	public currentWorld?: `Area${number}` = undefined;
	private localPlayer = Players.LocalPlayer;

	onStart() {
		producer.subscribe(selectPlayerWorlds(tostring(this.localPlayer.UserId)), (worlds) => {
			if (!worlds) {
				return;
			}

			this.currentWorld = worlds.selected;
		});
	}
}
