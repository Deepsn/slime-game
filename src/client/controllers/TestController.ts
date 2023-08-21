import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { RootState, producer } from "client/producers";
import { selectPlayerData, selectPlayerSlime } from "shared/selectors";

@Controller()
export class TestController implements OnStart {
	constructor(private logger: Logger) {}

	onStart() {
		const localPlayer = Players.LocalPlayer;

		const selectPlayersSlimes = (state: RootState) => state.players.slime;

		const selectPlayersSlimeSize = (id: number) => {
			return createSelector(selectPlayersSlimes, (slimes) => {
				return slimes[id];
			});
		};

		producer.observe(selectPlayersSlimes, (data, id) => {
			print(id);
			producer.subscribe(selectPlayersSlimeSize(id), (slime) => {
				print("size", slime?.size);
			});
		});
	}
}
