import { CollectionService, Players } from "@rbxts/services";
import { UIElement } from "./UIController";

export class UIClass<T extends GuiObject> implements UIElement {
	protected readonly tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.Out);
	protected localPlayer = Players.LocalPlayer;
	protected instance: T;

	constructor(tagName: `UI${string}`) {
		CollectionService.GetInstanceAddedSignal(tagName).Connect((instance) => {
			this.instance = instance as T;
			this.onStart();
		});

		this.instance = CollectionService.GetTagged(tagName)[0] as T;
		if (this.instance) task.spawn(() => this.onStart());
	}

	onStart(): void {}
	activate() {}
	deactivate() {}
}
