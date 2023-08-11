interface ReplicatedStorage {
	assets: Folder & {
		overhead: BillboardGui & {
			bg: Frame & {
				plr_name: TextLabel;
				Level: TextLabel;
				Kills: TextLabel;
			};
		};
	};
}
