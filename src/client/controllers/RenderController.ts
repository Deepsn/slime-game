import { Controller, OnStart } from "@flamework/core";

@Controller()
export class RenderController implements OnStart {
	public readonly RENDER_DISTANCE = 50;

	onStart() {}
}
