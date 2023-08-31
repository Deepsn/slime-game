export type QuestsFrame = Frame & {
	QuestsFrame: ImageLabel & {
		Timer: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		Frames: Frame & {
			UIListLayout: UIListLayout;
			UICorner: UICorner;
		};
		Title: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	CloseButton: ImageButton;
	UIAspectRatioConstraint: UIAspectRatioConstraint;
};
