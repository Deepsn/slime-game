import { Signal } from "@rbxts/beacon";
import { Janitor } from "@rbxts/janitor";
import { Producer } from "@rbxts/reflex";
import { MarketplaceService, Players } from "@rbxts/services";
import { selectPlayerBoosts } from "shared/selectors";
import { SharedState } from "shared/slices";

export class Products {
	private localPlayer = Players.LocalPlayer;

	constructor(private producer: Producer<SharedState>) {}

	hasGamepass(assetId: number, _userId?: number) {
		const userId = _userId ?? this.localPlayer.UserId;

		if (!userId) {
			return false;
		}

		const [success, hasGamepass] = pcall(() => {
			return MarketplaceService.UserOwnsGamePassAsync(userId, assetId);
		});

		return success && hasGamepass;
	}

	hasBoost(boostName: string, _userId?: number) {
		const userId = _userId ?? this.localPlayer.UserId;

		if (!userId) {
			return false;
		}

		const boostState = this.producer.getState(selectPlayerBoosts(tostring(userId)));

		return boostState?.[boostName as never] !== undefined;
	}

	onProductPurchase(productType: "gamepass" | "product", _player?: Player) {
		const janitor = new Janitor();
		const signal = janitor.Add(new Signal());
		const player = _player ?? this.localPlayer;

		if (productType === "gamepass") {
			janitor.Add(
				MarketplaceService.PromptBundlePurchaseFinished.Connect((target, assetId, purchased) => {
					if (target !== player || !purchased) {
						return;
					}

					signal.Fire(assetId);
				}),
			);
		} else {
			janitor.Add(
				MarketplaceService.PromptProductPurchaseFinished.Connect((targetUserId, assetId, purchased) => {
					if (targetUserId !== player.UserId || !purchased) {
						return;
					}

					signal.Fire(assetId);
				}),
			);
		}

		return [signal, janitor];
	}
}
