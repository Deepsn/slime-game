export type LeftHudFrame = Frame & {
	Leaderboard: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	Magnet: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	UIListLayout: UIListLayout;
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	XP: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	Shop: ImageButton & {
		TextLabel: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		Notif: ImageLabel;
	};
};
