import { OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { t } from "@rbxts/t";
import { Players } from "@rbxts/services";

@Component({
	tag: "Overhead",
	attributes: {
		owner: t.number,
	},
})
export default class Overhead
	extends BaseComponent<{ owner: number }, ReplicatedStorage["assets"]["overhead"]>
	implements OnTick
{
	private owner = Players.GetPlayerByUserId(this.attributes.owner);
	private backgroundFrame = this.instance.bg;

	constructor() {
		super();

		if (!this.owner) {
			this.destroy();
		}
	}

	onTick() {
		if (!this.owner) {
			return;
		}

		const leaderstats = this.owner.FindFirstChild("leaderstats") as Leaderstats | undefined;

		if (!leaderstats) {
			return;
		}

		const isProtected = this.owner.GetAttribute("Protected") as boolean;

		this.backgroundFrame.plr_name.Text = `${this.owner.Name}${isProtected ? " - 🛡" : ""}`;
		this.backgroundFrame.Kills.Text = `${leaderstats.Kills.Value} KILLS`;
	}
}
