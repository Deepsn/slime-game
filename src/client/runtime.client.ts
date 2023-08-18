import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconClient } from "@rbxts/zircon";

Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.WriteTo(Zircon.Log.Console())
		.EnrichWithProperty("Version", "1.0.0")
		.Create(),
);

task.wait(1);

ZirconClient.Init({
	AutoFocusTextBox: false,
	EnableTags: true,
	Keys: [Enum.KeyCode.Insert],
});

Modding.registerDependency<Logger>((actor) => Log.ForContext(actor));

Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/components");
Flamework.addPaths("src/shared/components");

Flamework.ignite();
