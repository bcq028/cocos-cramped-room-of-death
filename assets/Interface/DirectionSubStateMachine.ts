import { AnimationClip } from "cc"
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM } from "../Enum"
import State from "./State"
import { StateMachine } from "./StateMachine"
import { SubStateMachine } from "./SubStateMachine"

const BASE_URL = 'texture/player/idle'

export default class DirectionSubStateMachine extends SubStateMachine {
  run(){
    const value=this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION);
    this.currentState=this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
