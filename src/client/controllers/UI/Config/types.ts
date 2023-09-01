export type ConfigFrame = Frame & {
	QuestsFrame: ImageLabel & {
		Result: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		Title: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		Frames: Frame & {
			Sounds: Frame & {
				UIGradient: UIGradient;
				UICorner: UICorner;
				UIStroke: UIStroke;
				Enable: ImageButton;
				Disable: ImageButton;
			};
			Shadows: Frame & {
				UIGradient: UIGradient;
				UICorner: UICorner;
				UIStroke: UIStroke;
				Enable: ImageButton;
				Disable: ImageButton;
			};
			UICorner: UICorner;
			Music: Frame & {
				UIGradient: UIGradient;
				UICorner: UICorner;
				UIStroke: UIStroke;
				Enable: ImageButton;
				Disable: ImageButton;
			};
			UIListLayout: UIListLayout;
		};
		CodeInfo: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	CloseButton: ImageButton;
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	TextBox: TextBox & {
		UICorner: UICorner;
		UITextSizeConstraint: UITextSizeConstraint;
	};
};
