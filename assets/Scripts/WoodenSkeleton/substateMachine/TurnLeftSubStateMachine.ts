import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../../Enum";
import DirectionSubStateMachine from "../../../Interface/DirectionSubStateMachine";
import State from "../../../Interface/State";
import { StateMachine } from "../../../Interface/StateMachine";
import { SubStateMachine } from "../../../Interface/SubStateMachine";

const BASE_URL = 'texture/player/turnleft'

export default class TurnLeftSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`))
  }
}
