export type BoostFrame = Frame & {
	Fuel: Frame & {
		UICorner: UICorner;
	};
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	ImageButton: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
};
