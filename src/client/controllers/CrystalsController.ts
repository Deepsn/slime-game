import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { RootState, producer } from "client/producers";
import { selectPlayerWorlds } from "shared/selectors";
import { Crystal } from "shared/slices/collectables";

@Controller()
export class CrystalsController implements OnStart {
	public crystalsContainer = new Instance("Folder");
	public crystals: Crystal[] = [];

	private crystalsFolder = ReplicatedStorage.Crystals;

	constructor(private logger: Logger) {}

	onStart() {
		const localPlayer = Players.LocalPlayer;

		this.crystalsContainer.Name = "CrystalsContainer";
		this.crystalsContainer.Parent = Workspace;

		const selectCrystals = (state: RootState) => {
			return state.collectables.crystals;
		};

		const selectCurrentWorld = (userId: string) => {
			return createSelector(selectPlayerWorlds(userId), (worlds) => {
				return worlds?.selected;
			});
		};

		const selectCrystalsInArea = (areaId: `Area${number}`) => {
			return createSelector(selectCrystals, (crystals) => {
				return crystals[areaId];
			});
		};

		producer.subscribe(selectCurrentWorld(tostring(localPlayer.UserId)), (area) => {
			if (area === undefined) {
				return;
			}

			const unobserve = producer.observe(selectCrystalsInArea(area), (crystal) => {
				this.crystals.push(crystal);

				const crystalInstance = this.crystalsFolder.FindFirstChild(crystal.color)?.Clone() as
					| MeshPart
					| undefined;

				const removeCollider = (instance: BasePart | Model) => {
					if (t.instanceIsA("Model")(instance)) {
						instance.GetChildren().forEach((object) => {
							if (t.union(t.instanceIsA("Model"), t.instanceIsA("BasePart"))(object)) {
								removeCollider(object);
							}
						});
					} else {
						instance.CanCollide = false;
						instance.CanTouch = false;
					}
				};

				if (crystalInstance) {
					removeCollider(crystalInstance);
					crystalInstance.Name = crystal.id;
					crystalInstance.PivotTo(new CFrame(crystal.position));
					crystalInstance.Parent = this.crystalsContainer;

					crystalInstance.AddTag("Crystal");
				}

				return () => {
					crystalInstance?.Destroy();
					this.crystals = this.crystals.filter((crystalObject) => crystalObject !== crystal);
				};
			});

			return unobserve;
		});
	}
}
