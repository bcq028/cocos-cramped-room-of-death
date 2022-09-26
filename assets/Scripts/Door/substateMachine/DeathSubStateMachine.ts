import { DIRECTION_ENUM } from "../../../Enum"
import DirectionSubStateMachine from "../../../Interface/DirectionSubStateMachine"
import State from "../../../Interface/State"
import { StateMachine } from "../../../Interface/StateMachine"

const BASE_URL = 'texture/door/death'

export default class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}`))
  }
}
