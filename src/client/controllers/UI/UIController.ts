import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface UIElement {
	activate(): void;
	deactivate(): void;
}

@Controller()
export class UIController implements OnStart {
	private localPlayer = Players.LocalPlayer;
	private currentInterface: UIElement | undefined;

	onStart() {
		const playerGui = this.localPlayer.WaitForChild("PlayerGui");
		const ui = playerGui.WaitForChild("ScreenGui");

		for (const uiElement of ui.GetChildren()) {
			uiElement.AddTag(`UI${uiElement.Name.gsub(" ", "")[0]}`);
		}
	}

	changeInterface(newInterface?: UIElement) {
		this.currentInterface?.deactivate();

		if (!newInterface || this.currentInterface === newInterface) {
			this.currentInterface = undefined;
			return;
		}

		this.currentInterface = newInterface;
		this.currentInterface.activate();
	}
}
