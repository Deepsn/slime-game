export type UpgradeFrame = Frame & {
	CloseButton: ImageButton;
	UpgradeFrame: ImageLabel & {
		Title: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		Frames: Frame & {
			Magnet: Frame & {
				Cost: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				UIGradient: UIGradient;
				Upgrade: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UICorner: UICorner;
				UIStroke: UIStroke;
				Icon: ImageLabel & {
					UICorner: UICorner;
				};
				UpgradeInfo: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Booster: Frame & {
				Cost: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				UIGradient: UIGradient;
				Upgrade: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UICorner: UICorner;
				UIStroke: UIStroke;
				Icon: ImageLabel & {
					UICorner: UICorner;
				};
				UpgradeInfo: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			["XP Boost"]: Frame & {
				Cost: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				UIGradient: UIGradient;
				Upgrade: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UICorner: UICorner;
				UIStroke: UIStroke;
				Icon: ImageLabel & {
					UICorner: UICorner;
				};
				UpgradeInfo: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			UICorner: UICorner;
			["Gold  Boost"]: Frame & {
				Cost: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				UIGradient: UIGradient;
				Upgrade: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UICorner: UICorner;
				UIStroke: UIStroke;
				Icon: ImageLabel & {
					UICorner: UICorner;
				};
				UpgradeInfo: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Speed: Frame & {
				Cost: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				UIGradient: UIGradient;
				Upgrade: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UICorner: UICorner;
				UIStroke: UIStroke;
				Icon: ImageLabel & {
					UICorner: UICorner;
				};
				UpgradeInfo: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			UIListLayout: UIListLayout;
		};
	};
	UIAspectRatioConstraint: UIAspectRatioConstraint;
};
