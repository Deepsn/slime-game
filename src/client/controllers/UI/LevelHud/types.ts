export type LevelHudFrame = Frame & {
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	Level: ImageLabel & {
		Title: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		LevelGUI: Frame & {
			LevelNum: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			LevelBar: Frame & {
				UICorner: UICorner;
				UIStroke: UIStroke;
			};
			Point: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			UICorner: UICorner;
		};
	};
};
