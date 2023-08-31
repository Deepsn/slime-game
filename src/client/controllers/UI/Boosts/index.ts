import { Controller, OnTick } from "@flamework/core";
import { UIClass } from "../UIClass";
import { BoostsFrame } from "./types";
import { producer } from "client/producers";
import { selectPlayerBoosts } from "shared/selectors";
import { PlayerBoosts } from "shared/slices/players";
import { createSelector } from "@rbxts/reflex";

@Controller()
export class BoostsController extends UIClass<BoostsFrame> implements OnTick {
	private updateTick = 0;
	private xp2x = 0;

	constructor() {
		super("UIBoosts");
	}

	onStart() {
		const selectPlayerBoost = (boostName: keyof PlayerBoosts) => {
			return createSelector(selectPlayerBoosts(tostring(this.localPlayer.UserId)), (boosts) => {
				return boosts?.[boostName];
			});
		};

		producer.subscribe(selectPlayerBoost("xp2x"), (boost) => {
			if (!boost) {
				this.xp2x = 0;
				return;
			}

			this.xp2x = boost.endTick;
		});
	}

	onTick(dt: number): void {
		this.updateTick += dt;

		if (this.updateTick >= 1) {
			this.updateTick = 0;
			const now = DateTime.now().UnixTimestamp;

			if (this.xp2x > 0) {
				this.instance.XP.BoostTime.Text = `${this.xp2x - now}`;
				this.instance.XP.Visible = true;
			} else if (this.instance.XP.Visible) {
				this.instance.XP.Visible = false;
			}
		}
	}
}
