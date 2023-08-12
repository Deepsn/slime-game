interface Controls {
	GetMoveVector(): Vector3;
}

interface PlayerModule {
	GetControls(): Controls;
}
