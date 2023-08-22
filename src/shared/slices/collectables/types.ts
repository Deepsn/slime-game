export interface Collectable {
	id: string;
	value: number;
	position: Vector3;
	type?: "Crystal" | "Coin";
}

export interface Crystal extends Collectable {
	color: string;
}

export interface Coin extends Collectable {}
