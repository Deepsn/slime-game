import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

@Controller()
export class UIController implements OnStart {
	private localPlayer = Players.LocalPlayer;

	onStart() {
		const playerGui = this.localPlayer.WaitForChild("PlayerGui");
		const ui = playerGui.WaitForChild("ScreenGui");

		for (const uiElement of ui.GetChildren()) {
			uiElement.AddTag(`UI${uiElement.Name}`);
		}
	}
}
