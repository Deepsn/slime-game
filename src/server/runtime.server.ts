import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, {
	ZirconConfigurationBuilder,
	ZirconDefaultGroup,
	ZirconFunctionBuilder,
	ZirconServer,
} from "@rbxts/zircon";
import { producer } from "./producers";

Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.WriteTo(Zircon.Log.Console())
		.EnrichWithProperty("Version", "1.0.0")
		.Create(),
);

task.wait(0.5);

const setSizeFunction = new ZirconFunctionBuilder("add_slime_size").AddArgument("number").Bind((context, size) => {
	const executor = context.GetExecutor();
	producer.changeSlimeStat(executor.UserId, "size", size);
});

// TODO: change ZirconGroup.User -> ZirconGroup.Admin
ZirconServer.Registry.Init(
	ZirconConfigurationBuilder.default().AddFunction(setSizeFunction, [ZirconDefaultGroup.User]).Build(),
);

Modding.registerDependency<Logger>((actor) => Log.ForContext(actor));

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/components");
Flamework.addPaths("src/shared/components");

Flamework.ignite();
