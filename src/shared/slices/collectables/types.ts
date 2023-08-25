export interface Collectable {
	id: string;
	areaId: `Area${number}`;
	value: number;
	originalPosition?: Vector3;
	position: Vector3;
	type?: "Crystal" | "Coin";
}

export interface Crystal extends Collectable {
	color: string;
}

export interface Coin extends Collectable {}
