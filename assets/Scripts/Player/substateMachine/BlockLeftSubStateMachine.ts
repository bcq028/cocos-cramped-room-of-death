import { DIRECTION_ENUM } from "../../../Enum"
import DirectionSubStateMachine from "../../../Interface/DirectionSubStateMachine"
import State from "../../../Interface/State"
import { StateMachine } from "../../../Interface/StateMachine"

const BASE_URL = 'texture/player/blockleft'

export default class BlockLeftSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`))
  }
}
