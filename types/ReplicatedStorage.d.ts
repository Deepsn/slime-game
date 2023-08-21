interface ReplicatedStorage {
	assets: Folder & {
		Overhead: BillboardGui & {
			bg: Frame & {
				plr_name: TextLabel;
				Level: TextLabel;
				Kills: TextLabel;
			};
		};
		PlayerMesh: MeshPart;
	};
	Crystals: Folder & {
		Blue: MeshPart & {
			PointLight: PointLight;
		};
		Green: MeshPart & {
			PointLight: PointLight;
		};
		Yellow: MeshPart & {
			PointLight: PointLight;
		};
		Coin: Model;
		Purple: MeshPart & {
			PointLight: PointLight;
		};
	};
}
