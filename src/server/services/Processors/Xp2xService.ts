import { Service, OnStart } from "@flamework/core";
import { ProductsService } from "../ProductsService";
import ids from "shared/lib/products/ids";
import { producer } from "server/producers";
import { Players } from "@rbxts/services";
import { selectPlayerReceipts } from "shared/selectors";

@Service()
export class Xp2xService implements OnStart {
	private productId = ids.boosts.xp2x;

	constructor(private readonly productsService: ProductsService) {}

	onStart() {
		this.productsService.processors.add((receiptInfo) => {
			if (receiptInfo.ProductId !== this.productId) {
				return false;
			}

			const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);

			if (!player) {
				return false;
			}

			const receipts = producer.getState(selectPlayerReceipts(tostring(receiptInfo.PlayerId)));

			if (!receipts || receipts[receiptInfo.PurchaseId as never]) {
				return false;
			}

			const expiration = 3 * 60; // seconds

			producer.addReceipt(tostring(receiptInfo.PlayerId), receiptInfo.PurchaseId);
			producer.setBoost(tostring(receiptInfo.PlayerId), "xp2x", {
				endTick: tick() + expiration,
				timeLeft: expiration,
			});

			return true;
		});
	}
}
