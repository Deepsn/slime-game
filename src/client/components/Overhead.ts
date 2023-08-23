import { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { t } from "@rbxts/t";
import { Players } from "@rbxts/services";
import SlimeSizeController from "client/controllers/SlimeSizeController";
import { producer } from "client/producers";
import { selectPlayerStats } from "shared/selectors";

@Component({
	tag: "Overhead",
	attributes: {
		owner: t.number,
	},
})
export default class Overhead
	extends BaseComponent<{ owner: number }, ReplicatedStorage["assets"]["Overhead"]>
	implements OnStart, OnTick
{
	private owner = Players.GetPlayerByUserId(this.attributes.owner);
	private backgroundFrame = this.instance.bg;

	constructor(private readonly slimeSizeController: SlimeSizeController) {
		super();
	}

	onStart(): void {
		if (!this.owner) {
			return;
		}

		const unsubscribe = producer.subscribe(selectPlayerStats(tostring(this.owner.UserId)), (stats) => {
			if (!stats || !this.owner) {
				return;
			}

			this.backgroundFrame.Kills.Text = `${stats.kills} KILLS`;
			this.backgroundFrame.Level.Text = `Level ${stats.level}`;
			this.backgroundFrame.plr_name.Text = `${this.owner.Name}${stats.forcefield ? " - 🛡️" : ""}`;
		});

		this.backgroundFrame.plr_name.Text = this.owner.Name;

		this.maid.statsUnsubscribe = unsubscribe;
	}

	onTick() {
		if (!this.owner) {
			return;
		}

		const size = this.slimeSizeController.sizes.get(this.owner.UserId) ?? 0;
		this.instance.StudsOffsetWorldSpace = Vector3.yAxis.mul(size / 2 + 2);
	}
}
