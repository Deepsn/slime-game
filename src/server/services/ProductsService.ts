import { Service, OnStart } from "@flamework/core";
import { MarketplaceService } from "@rbxts/services";
import { OnPlayer } from "./PlayerJoinService";
import { Logger } from "@rbxts/log";
import { PlayerBoosts } from "shared/slices/players";
import { RootState, producer } from "server/producers";

@Service()
export class ProductsService implements OnStart, OnPlayer {
	public processors = new Set<(receiptInfo: ReceiptInfo) => boolean>();

	private cache = new Map<Player, Set<number>>();

	constructor(private logger: Logger) {}

	onStart() {
		MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, gamepassId, purchased) => {
			if (!purchased) {
				return;
			}

			const playerCache = this.getCache(player);

			if (playerCache.has(gamepassId)) {
				this.logger.Warn(
					"Player already had gamepass in cache: {gamepassId} ({player})",
					gamepassId,
					player.Name,
				);
				return;
			}

			playerCache.add(gamepassId);
		});

		MarketplaceService.ProcessReceipt = (receiptInfo) => {
			for (const process of this.processors) {
				const [success, result] = pcall(() => process(receiptInfo));

				if (success && result) {
					return Enum.ProductPurchaseDecision.PurchaseGranted;
				}
			}

			return Enum.ProductPurchaseDecision.NotProcessedYet;
		};
	}

	onPlayerJoin(player: Player): void {
		this.getCache(player);
	}

	onPlayerLeave(player: Player): void {
		this.cache.delete(player);
	}

	private getCache(player: Player) {
		const playerCache = this.cache.get(player);

		if (playerCache) {
			return playerCache;
		}

		const cache = new Set<number>();

		this.cache.set(player, cache);
		return cache;
	}

	hasGamepass(player: Player, assetId: number) {
		const playerCache = this.getCache(player);

		return playerCache.has(assetId);
	}

	hasBoost(player: Player, boostName: keyof PlayerBoosts) {
		const selectPlayerBoost = (state: RootState) => {
			return state.players.boosts[player.UserId]?.[boostName];
		};

		const boost = producer.getState(selectPlayerBoost);

		if (!boost) {
			return false;
		}

		return boost.endTick > tick();
	}
}
