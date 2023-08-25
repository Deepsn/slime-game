export type MoneyHudFrame = Frame & {
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	Coins: ImageLabel & {
		ImageButton: ImageButton;
		Coins: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
};
