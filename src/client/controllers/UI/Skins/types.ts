export type SkinsFrame = Frame & {
	Frame: ImageLabel & {
		ScrollingFrame: ScrollingFrame & {
			UIGridLayout: UIGridLayout;
			UniqueSkinFrame: Frame & {
				UIGradient: UIGradient;
				UIStroke: UIStroke;
				UICorner: UICorner;
				SkinName: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				ViewportFrame: ViewportFrame & {
					UICorner: UICorner;
				};
				Equip: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			LockedSkinFrame: Frame & {
				Locked: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UICorner: UICorner;
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
			};
			UICorner: UICorner;
			EpicSkinFrame: Frame & {
				UIGradient: UIGradient;
				UICorner: UICorner;
				SkinName: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
				ViewportFrame: ViewportFrame & {
					UICorner: UICorner;
				};
				Equip: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			CommonSkinFrame: Frame & {
				UIGradient: UIGradient;
				UICorner: UICorner;
				SkinName: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
				ViewportFrame: ViewportFrame & {
					UICorner: UICorner;
				};
				Equip: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			RareSkinFrame: Frame & {
				UIGradient: UIGradient;
				UICorner: UICorner;
				SkinName: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
				ViewportFrame: ViewportFrame & {
					UICorner: UICorner;
				};
				Equip: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UIGradient: UIGradient;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
		};
	};
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	CloseButton: ImageButton;
};
