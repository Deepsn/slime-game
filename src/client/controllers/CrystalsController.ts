import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { RootState, producer } from "client/producers";
import { selectPlayerWorlds } from "shared/selectors";
import { selectPlayerCurrentWorld } from "shared/selectors/players";
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

		const selectCrystalsInArea = (areaId: `Area${number}`) => {
			return createSelector(selectCrystals, (crystals) => {
				return crystals[areaId];
			});
		};

		const selectCrystalPosition = (areaId: `Area${number}`, crystalId: string) => {
			return createSelector(selectCrystalsInArea(areaId), (crystals) => {
				return crystals?.[crystalId]?.position;
			});
		};

		producer.subscribe(selectPlayerCurrentWorld(tostring(localPlayer.UserId)), (area) => {
			if (!area) {
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

				const unsubscribe = producer.subscribe(selectCrystalPosition(area, crystal.id), (position) => {
					if (!position) {
						return;
					}

					if (crystalInstance) {
						crystalInstance.PivotTo(new CFrame(position));
					}
				});

				if (crystalInstance) {
					removeCollider(crystalInstance);
					crystalInstance.Name = crystal.id;
					crystalInstance.PivotTo(new CFrame(crystal.position));
					crystalInstance.Parent = this.crystalsContainer;

					crystalInstance.AddTag("Crystal");
				}

				return () => {
					unsubscribe();
					crystalInstance?.Destroy();
					this.crystals = this.crystals.filter((crystalObject) => crystalObject !== crystal);
				};
			});

			return unobserve;
		});
	}
}
