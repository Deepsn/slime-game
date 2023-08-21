export interface Collectable {
	type?: "Coin" | "Crystal";
	id: string;
	value: number;
	color: string;
	position: Vector3;
}
