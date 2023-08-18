import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconConfigurationBuilder, ZirconServer } from "@rbxts/zircon";

Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.WriteTo(Zircon.Log.Console())
		.EnrichWithProperty("Version", "1.0.0")
		.Create(),
);

ZirconServer.Registry.Init(ZirconConfigurationBuilder.default().Build());

Modding.registerDependency<Logger>((actor) => Log.ForContext(actor));

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/components");
Flamework.addPaths("src/shared/components");

Flamework.ignite();
