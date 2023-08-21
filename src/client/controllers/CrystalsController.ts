import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { RootState, producer } from "client/producers";

@Controller()
export class CrystalsController implements OnStart {
	private crystalsFolder = ReplicatedStorage.Crystals;
	private crystalsContainer = new Instance("Folder");

	// constructor(private logger: Logger) {}

	onStart() {
		const localPlayer = Players.LocalPlayer;

		this.crystalsContainer.Name = "CrystalsContainer";
		this.crystalsContainer.Parent = Workspace;

		const selectCrystals = (state: RootState) => {
			return state.collectables.crystals;
		};

		const selectPlayerWorld = (state: RootState) => {
			return state.players.worlds[localPlayer.UserId];
		};

		const selectCrystalsInArea = (area: string) => {
			return createSelector(selectCrystals, (crystals) => {
				return crystals[area];
			});
		};

		producer.subscribe(selectPlayerWorld, (world) => {
			print("Player area: {area}", world);

			if (world === undefined) {
				return;
			}

			const unsubscribe = producer.observe(selectCrystalsInArea(world.selected), (crystal) => {
				const crystalInstance = this.crystalsFolder.FindFirstChild(crystal.color)?.Clone() as
					| Model
					| MeshPart
					| undefined;

				print("Creating crystal: {crystal}", crystal);

				if (crystalInstance) {
					crystalInstance.SetAttribute("Id", crystal.id);
					crystalInstance.PivotTo(new CFrame(crystal.position));
					crystalInstance.Parent = this.crystalsContainer;
				}

				return () => {
					crystalInstance?.Destroy();
				};
			});

			return unsubscribe;
		});
	}
}
