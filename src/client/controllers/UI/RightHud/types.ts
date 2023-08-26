export type RightHudFrame = Frame & {
	DailyQuest: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	Config: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	Evolution: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	UIListLayout: UIListLayout;
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	Skins: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
};
