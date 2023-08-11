local ReplicatedStorage = game:GetService("ReplicatedStorage")

return {
	[1] = {
		Crystal = ReplicatedStorage.Crystals.Purple,
		Rarity = 1,
		Points = {
			[1] = 100,
			[2] = 200,
			[3] = 400,
			[4] = 500,
			[5] = 600
		},
		Value = "Crystals"
	},
	
	[2] = {
		Crystal = ReplicatedStorage.Crystals.Yellow,
		Rarity = 4,
		Points = {
			[1] = 30,
			[2] = 50,
			[3] = 100,
			[4] = 150,
			[5] = 220
		},
		Value = "Crystals"
	},
	
	[3] = {
		Crystal = ReplicatedStorage.Crystals.Blue,
		Rarity = 15,
		Points = {
			[1] = 15,
			[2] = 30,
			[3] = 60,
			[4] = 90,
			[5] = 100
		},
		Value = "Crystals"
	},
	
	[4] = {
		Crystal = ReplicatedStorage.Crystals.Green,
		Rarity = 80,
		Points = {
			[1] = 5,
			[2] = 10,
			[3] = 20,
			[4] = 40,
			[5] = 60
		},
		Value = "Crystals"
	},
	
	[5] = {
		Crystal = ReplicatedStorage.Crystals.Coin,
		Rarity = 50,
		Points = {
			[1] = 1,
			[2] = 1,
			[3] = 1,
			[4] = 1,
			[5] = 1
		},
		Value = "Coins"
	},
}