export type ShopFrame = Frame & {
	QuestsFrame: ImageLabel;
	CloseButton: ImageButton;
	ScrollingFrame: ScrollingFrame & {
		Chests: Frame & {
			Flag: ImageLabel & {
				TextLabel: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			["Epic Chest"]: ImageLabel & {
				RobuxBuy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
			};
			["Rare Chest"]: ImageLabel & {
				ImageLabel: ImageLabel;
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			["Commom Chest"]: ImageLabel & {
				ImageLabel: ImageLabel;
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
		};
		Packs: Frame & {
			Flag: ImageLabel & {
				TextLabel: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			EpicPack1: ImageLabel & {
				Claim: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			EpicPack3: ImageLabel & {
				Claim: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			EpicPack2: ImageLabel & {
				Claim: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
		};
		Skins: Frame & {
			Flag: ImageLabel & {
				TextLabel: TextLabel;
				Timer: TextLabel;
			};
			["Rare Skin Frame"]: ImageLabel & {
				SkinShow: ViewportFrame;
				SkinName: TextLabel;
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
			};
			TextLabel: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
				UIStroke: UIStroke;
			};
			["Epic  Skin Frame"]: ImageLabel & {
				SkinShow: ViewportFrame;
				SkinName: TextLabel;
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
			};
		};
		Boosts: Frame & {
			Flag: ImageLabel & {
				GAMEPASSES: TextLabel;
			};
			["2xGOLD"]: ImageLabel & {
				BoostName: TextLabel;
				["1hour"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
				["30min"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
				["15min"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
				ImageLabel: ImageLabel;
			};
			["2xMAGNET"]: ImageLabel & {
				BoostName: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
				["1hour"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				["30min"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				["15min"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
				ImageLabel: ImageLabel;
			};
			["2xXP"]: ImageLabel & {
				BoostName: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
				["1hour"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
				["30min"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
				["15min"]: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
				};
				ImageLabel: ImageLabel;
			};
		};
		UIListLayout: UIListLayout;
		Coins: Frame & {
			Coin15000: ImageLabel & {
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
				Coin: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Coin30000: ImageLabel & {
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
				Coin: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Coin7000: ImageLabel & {
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
				Coin: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Flag: ImageLabel & {
				Coins: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Coin60000: ImageLabel & {
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
				Coin: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Coin3000: ImageLabel & {
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
				Coin: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
			Coin120000: ImageLabel & {
				UIGradient: UIGradient;
				ImageLabel: ImageLabel;
				Coin: TextLabel & {
					UITextSizeConstraint: UITextSizeConstraint;
					UIStroke: UIStroke;
				};
				Buy: TextButton & {
					UICorner: UICorner;
					UIStroke: UIStroke;
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
		};
	};
	UIAspectRatioConstraint: UIAspectRatioConstraint;
};
