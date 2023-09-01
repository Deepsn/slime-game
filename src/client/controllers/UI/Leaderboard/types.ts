export type LeaderboardFrame = Frame & {
	QuestsFrame: ImageLabel & {
		Timer: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	CloseButton: ImageButton;
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	ScrollingFrame: ScrollingFrame & {
		TopNormal: Frame & {
			PlayerImage: ImageLabel;
			UIGradient: UIGradient;
			PlyrName: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			UICorner: UICorner;
			UIStroke: UIStroke;
			Points: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			Rank: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
		};
		UIListLayout: UIListLayout;
		Top2: Frame & {
			Points: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			PlayerImage: ImageLabel;
			UIGradient: UIGradient;
			PlyrName: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			UICorner: UICorner;
			UIStroke: UIStroke;
			Rank: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			ImageLabel: ImageLabel;
		};
		Top1: Frame & {
			Points: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			PlayerImage: ImageLabel;
			UIGradient: UIGradient;
			PlyrName: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			UICorner: UICorner;
			UIStroke: UIStroke;
			Rank: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			ImageLabel: ImageLabel;
		};
		Top3: Frame & {
			Points: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			PlayerImage: ImageLabel;
			UIGradient: UIGradient;
			PlyrName: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			UICorner: UICorner;
			UIStroke: UIStroke;
			Rank: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
			};
			ImageLabel: ImageLabel;
		};
	};
	ImageLabel: ImageLabel;
};
