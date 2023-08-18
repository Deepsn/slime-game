export interface CrystalEntity extends MeshPart {
	PointLight: PointLight;
}

export interface Crystal {
	id: string;
	points: number;
	entity: CrystalEntity;
}
