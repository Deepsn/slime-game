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
}
