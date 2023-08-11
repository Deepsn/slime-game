import { OnInit, OnStart, Controller } from "@flamework/core";

@Controller()
export default class overhead implements OnInit, OnStart {
	onInit(): void | Promise<void> {}

	onStart(): void {}
}
