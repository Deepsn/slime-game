export type BoostsFrame = Frame & {
	UIAspectRatioConstraint: UIAspectRatioConstraint;
	Magnet: ImageLabel & {
		BoostName: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		BoostTime: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	XP: ImageLabel & {
		BoostName: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		BoostTime: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
	Coin: ImageLabel & {
		BoostName: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
		BoostTime: TextLabel & {
			UITextSizeConstraint: UITextSizeConstraint;
		};
	};
};
