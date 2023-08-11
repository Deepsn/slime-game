local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")
local ServerStorage = game:GetService("ServerStorage")
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

local Crystals = ReplicatedStorage.Crystals
local Modules = ReplicatedStorage.Modules
local Remotes = ReplicatedStorage.Remotes

local CrystalsModule = require(Modules.Crystals)

local Cooldown = {}

local function Spawn(Plr, Amount)
	local ToSpawn = {}
	
	for Index = 1, Amount do
		local Total = 0
		
		for _, Info in ipairs(CrystalsModule) do
			Total += Info.Rarity
		end
		
		local Selected = Random.new():NextNumber(0, Total)
		local Rarity = 0
		
		for Crystal, Info in ipairs(CrystalsModule) do
			Rarity += Info.Rarity
			
			if Selected <= Rarity then
				table.insert(ToSpawn, {Crystal, Info})
			end
		end
	end
	
	for _, Info in ipairs(ToSpawn) do
		local Area = workspace:FindFirstChild("Map "..Plr.Info.Area.Value).Spawn
		
		local Crystal = Info[2].Crystal:Clone()
		Crystal:SetAttribute("TypeName", Crystal.Name)
		Crystal.Name = HttpService:GenerateGUID(false)
		Crystal:SetAttribute("Type", Info[1])
		Crystal.Parent = Plr.Spawned
		
		if Crystal:IsA("BasePart") then
			Crystal:SetAttribute("Position", Area.Position + Vector3.new(math.random(-Area.Size.X / 2, Area.Size.X / 2), Area.Position.Y, math.random(-Area.Size.Z / 2, Area.Size.X / 2)))
			Crystal.Position = Area.Position + Vector3.new(math.random(-Area.Size.X / 2, Area.Size.X / 2), Area.Position.Y, math.random(-Area.Size.Z / 2, Area.Size.X / 2))
		elseif Crystal:IsA("Model") then
			Crystal:SetAttribute("Position", CFrame.new(Area.Position + Vector3.new(math.random(-Area.Size.X / 2, Area.Size.X / 2), Area.Position.Y, math.random(-Area.Size.Z / 2, Area.Size.X / 2))) * CFrame.Angles(math.rad(90), 0, 0))
			Crystal:SetPrimaryPartCFrame(CFrame.new(Area.Position + Vector3.new(math.random(-Area.Size.X / 2, Area.Size.X / 2), Area.Position.Y, math.random(-Area.Size.Z / 2, Area.Size.X / 2))) * CFrame.Angles(math.rad(90), 0, 0))
		end
	end
end

Players.PlayerAdded:Connect(function(Plr)
	local Leaderstats = Instance.new("Folder")
	Leaderstats.Name = "leaderstats"
	Leaderstats.Parent = Plr
	
	local Info = Instance.new("Folder")
	Info.Name = "Info"
	Info.Parent = Plr
	
	local Spawned = Instance.new("Folder")
	Spawned.Name = "Spawned"
	Spawned.Parent = Plr
	
	local Crystal = Instance.new("IntValue")
	Crystal.Name = "Crystals"
	Crystal.Value = 0
	Crystal.Parent = Leaderstats
	
	local Coins = Instance.new("IntValue")
	Coins.Name = "Coins"
	Coins.Value = 0
	Coins.Parent = Leaderstats
	
	local Area = Instance.new("IntValue")
	Area.Name = "Area"
	Area.Value = 1
	Area.Parent = Info
	
	local Range = Instance.new("IntValue")
	Range.Name = "Range"
	Range.Value = 10
	Range.Parent = Info
	
	Plr.CharacterAdded:Connect(function(Char)
		local Hitbox = ServerStorage.Hitbox:Clone()
		Hitbox.Position = Char.PrimaryPart.Position
		Hitbox.Parent = Char
		
		local Weld = Instance.new("Weld")
		Weld.Part0 = Char.PrimaryPart
		Weld.Part1 = Hitbox
		Weld.Parent = Hitbox
	end)
	
	Spawn(Plr, 500)
end)

Remotes.Get.OnServerEvent:Connect(function(Plr, GUID)
	if table.find(Cooldown, GUID) then
		return
	end
	
	if not Plr.Spawned:FindFirstChild(GUID) then
		warn("Hacker")
		return
	end
	
	local Crystal = Plr.Spawned[GUID]:IsA("Model") and Plr.Spawned[GUID].PrimaryPart or Plr.Spawned[GUID]
	
	if (Plr.Character.PrimaryPart.Position - Crystal.Position).Magnitude > Plr.Info.Range.Value then
		print("Hacker 2")
		return
	end
	
	table.insert(Cooldown, GUID)
	
	Plr.leaderstats:FindFirstChild(CrystalsModule[Plr.Spawned[GUID]:GetAttribute("Type")].Value).Value += CrystalsModule[Plr.Spawned[GUID]:GetAttribute("Type")].Points[Plr.Info.Area.Value]
	Plr.Spawned[GUID]:Destroy()
	
	task.delay(5, function()
		table.remove(Cooldown, table.find(Cooldown, GUID))
	end)
	
	task.delay(20, function()
		Spawn(Plr, 1)
	end)
end)