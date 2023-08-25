import { CollectionService } from "@rbxts/services";

export class UIClass<T extends UIBase> {
	protected instance: T;

	constructor(tagName: `UI${string}`) {
		CollectionService.GetInstanceAddedSignal(tagName).Connect((instance) => {
			this.instance = instance as T;
			this.onStart();
		});

		this.instance = CollectionService.GetTagged(tagName)[0] as T;
		if (this.instance) this.onStart();
	}

	onStart(): void {}
}
