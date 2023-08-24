import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { RootState, producer } from "client/producers";
import { selectPlayerWorlds } from "shared/selectors";
import { Coin } from "shared/slices/collectables";

@Controller()
export class CoinsController implements OnStart {
	public coinsController = new Instance("Folder");
	public coins: Coin[] = [];

	private coinObject = ReplicatedStorage.Crystals.Coin;

	constructor(private logger: Logger) {}

	onStart() {
		const localPlayer = Players.LocalPlayer;

		this.coinsController.Name = "CoinsContainer";
		this.coinsController.Parent = Workspace;

		const selectCoins = (state: RootState) => {
			return state.collectables.coins;
		};

		const selectCurrentWorld = (userId: string) => {
			return createSelector(selectPlayerWorlds(userId), (worlds) => {
				return worlds?.selected;
			});
		};

		const selectCoinsInArea = (areaId: `Area${number}`) => {
			return createSelector(selectCoins, (coins) => {
				return coins[areaId];
			});
		};

		producer.subscribe(selectCurrentWorld(tostring(localPlayer.UserId)), (area) => {
			if (area === undefined) {
				return;
			}

			const unobserve = producer.observe(selectCoinsInArea(area), (coin) => {
				this.coins.push(coin);

				const coinInstance = this.coinObject.Clone();

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

				if (coinInstance) {
					removeCollider(coinInstance);
					coinInstance.Name = coin.id;
					coinInstance.PivotTo(new CFrame(coin.position));
					coinInstance.Parent = this.coinsController;

					coinInstance.AddTag("Coin");
				}

				return () => {
					coinInstance?.Destroy();
					this.coins = this.coins.filter((coinObject) => coinObject !== coin);
				};
			});

			return unobserve;
		});
	}
}
