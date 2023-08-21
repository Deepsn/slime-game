import { Controller, OnStart } from "@flamework/core";
import { ContextActionService } from "@rbxts/services";

@Controller()
export class InputController implements OnStart {
	public moveDirection = Vector3.zero;

	private forwardValue = 0;
	private backwardValue = 0;
	private rightValue = 0;
	private leftValue = 0;

	private PRIORITY_VALUE = Enum.ContextActionPriority.Medium.Value;

	private updateMovement(state: Enum.UserInputState) {
		if (state === Enum.UserInputState.Cancel) {
			this.moveDirection = Vector3.zero;
		} else {
			this.moveDirection = new Vector3(
				this.leftValue + this.rightValue,
				0,
				this.forwardValue + this.backwardValue,
			);
		}
	}

	private moveForward(state: Enum.UserInputState) {
		this.forwardValue = state === Enum.UserInputState.Begin ? 1 : 0;
		this.updateMovement(state);
		return Enum.ContextActionResult.Pass;
	}
	private moveBackward(state: Enum.UserInputState) {
		this.backwardValue = state === Enum.UserInputState.Begin ? -1 : 0;
		this.updateMovement(state);
		return Enum.ContextActionResult.Pass;
	}
	private moveRight(state: Enum.UserInputState) {
		this.rightValue = state === Enum.UserInputState.Begin ? 1 : 0;
		this.updateMovement(state);
		return Enum.ContextActionResult.Pass;
	}
	private moveLeft(state: Enum.UserInputState) {
		this.leftValue = state === Enum.UserInputState.Begin ? -1 : 0;
		this.updateMovement(state);
		return Enum.ContextActionResult.Pass;
	}

	onStart() {
		ContextActionService.BindActionAtPriority(
			"moveActionForward",
			(_: string, state: Enum.UserInputState) => this.moveForward(state),
			false,
			this.PRIORITY_VALUE,
			Enum.PlayerActions.CharacterForward,
		);
		ContextActionService.BindActionAtPriority(
			"moveActionBackward",
			(_: string, state: Enum.UserInputState) => this.moveBackward(state),
			false,
			this.PRIORITY_VALUE,
			Enum.PlayerActions.CharacterBackward,
		);
		ContextActionService.BindActionAtPriority(
			"moveActionRight",
			(_: string, state: Enum.UserInputState) => this.moveRight(state),
			false,
			this.PRIORITY_VALUE,
			Enum.PlayerActions.CharacterRight,
		);
		ContextActionService.BindActionAtPriority(
			"moveActionLeft",
			(_: string, state: Enum.UserInputState) => this.moveLeft(state),
			false,
			this.PRIORITY_VALUE,
			Enum.PlayerActions.CharacterLeft,
		);
	}
}
