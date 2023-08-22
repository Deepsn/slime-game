export interface Collectable {
	id: string;
	value: number;
	color: string;
	position: Vector3;
	type?: "Crystal" | "Coin";
}
