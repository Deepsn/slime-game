import { Controller, OnTick } from "@flamework/core";
import { UIClass } from "../UIClass";
import { BoostsFrame } from "./types";
import { producer } from "client/producers";
import { selectPlayerBoost, selectPlayerBoosts } from "shared/selectors";
import { PlayerBoosts } from "shared/slices/players";
import { createSelector } from "@rbxts/reflex";

@Controller()
export class BoostsController extends UIClass<BoostsFrame> implements OnTick {
	private updateTick = 0;
	private xp2x = 0;
	private coins2x = 0;
	private magnet2x = 0;

	constructor() {
		super("UIBoosts");
	}

	onStart() {
		const playerKey = tostring(this.localPlayer.UserId);

		producer.subscribe(selectPlayerBoost(playerKey, "xp2x"), (boost) => {
			if (!boost) {
				this.xp2x = 0;
				return;
			}

			this.xp2x = boost.endTick;
		});

		producer.subscribe(selectPlayerBoost(playerKey, "coins2x"), (boost) => {
			if (!boost) {
				this.xp2x = 0;
				return;
			}

			this.coins2x = boost.endTick;
		});

		producer.subscribe(selectPlayerBoost(playerKey, "magnet2x"), (boost) => {
			if (!boost) {
				this.xp2x = 0;
				return;
			}

			this.magnet2x = boost.endTick;
		});
	}

	onTick(dt: number): void {
		this.updateTick += dt;

		if (this.updateTick >= 1) {
			this.updateTick = 0;
			const now = DateTime.now().UnixTimestamp;
			const xpBoostFrame = this.instance.XP;
			const coinBoostFrame = this.instance.Coin;
			const magnetBoostFrame = this.instance.Magnet;

			if (this.xp2x !== 0) {
				xpBoostFrame.BoostTime.Text = `${this.xp2x - now}`;
				xpBoostFrame.Visible = true;
			} else if (xpBoostFrame.Visible) {
				xpBoostFrame.Visible = false;
			}

			if (this.coins2x !== 0) {
				coinBoostFrame.BoostTime.Text = `${this.coins2x - now}`;
				coinBoostFrame.Visible = true;
			} else if (this.instance.Coin.Visible) {
				coinBoostFrame.Visible = false;
			}

			if (this.magnet2x !== 0) {
				magnetBoostFrame.BoostTime.Text = `${this.magnet2x - now}`;
				magnetBoostFrame.Visible = true;
			} else if (magnetBoostFrame.Visible) {
				magnetBoostFrame.Visible = false;
			}
		}
	}
}
