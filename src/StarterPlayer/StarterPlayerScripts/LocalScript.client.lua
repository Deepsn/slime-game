local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local Crystals = ReplicatedStorage.Crystals
local Modules = ReplicatedStorage.Modules
local Remotes = ReplicatedStorage.Remotes

local Plr = Players.LocalPlayer

local Connections = {}

for _, Child in ipairs(Plr:WaitForChild("Spawned"):GetChildren()) do
	local Clone = Child:Clone()
	Clone.Parent = workspace.Crystals
	
	local Part = Clone:IsA("Model") and Clone.PrimaryPart or Clone
	
	Connections[Clone.Name] = Part.Touched:Connect(function(Hit)
		if Hit.Parent == Plr.Character then
			Remotes.Get:FireServer(Clone.Name)
		end
	end)
end

Plr:WaitForChild("Spawned").ChildAdded:Connect(function(Child)
	local Clone = Crystals:FindFirstChild(Child:GetAttribute("TypeName")):Clone()
	Clone.Parent = workspace.Crystals
	
	if Clone:IsA("Model") then
		Clone:SetPrimaryPartCFrame(Child:GetAttribute("Position"))
	else
		Clone.Position = Child:GetAttribute("Position")
	end
	
	local Part = Clone:IsA("Model") and Clone.PrimaryPart or Clone
	
	Connections[Clone.Name] = Part.Touched:Connect(function(Hit)
		if Hit.Parent == Plr.Character then
			Remotes.Get:FireServer(Clone.Name)
		end
	end)
end)

Plr:WaitForChild("Spawned").ChildRemoved:Connect(function(Child)
	for _, Crystal in ipairs(workspace.Crystals:GetChildren()) do
		if Crystal.Name == Child.Name then
			Crystal:Destroy()
			
			Connections[Child.Name]:Disconnect()
			Connections[Child.Name] = nil
		end
	end
end)