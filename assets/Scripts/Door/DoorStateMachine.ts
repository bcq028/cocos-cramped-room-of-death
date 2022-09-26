
import { _decorator,Animation, AnimationClip} from 'cc';
import {ENTITY_STATE_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { EntityManager } from '../../Interface/EntityManager';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Interface/StateMachine';
import DeathSubStateMachine from './substateMachine/DeathSubStateMachine';
import IdleSubStateMachine from './substateMachine/IdleSubStateMachine'

const { ccclass, property } = _decorator;


type ParamValueType=boolean|number;


export interface IParamValue{
  type:FSM_PARAM_TYPE_ENUM,
  value:ParamValueType
}

@ccclass('DoorStateMachine')
export class DoorStateMachine extends StateMachine {
    async init(){
      this.animationComponent=this.addComponent(Animation);
      this.initParams();
      this.initStateMache();
      await Promise.all(this.waittingList);
    }

    initParams(){
      this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
      this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())

    }
    initStateMache(){
      this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new IdleSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new DeathSubStateMachine(this))
    }
    run(){
          if(!this.currentState) {
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
          }
          if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);
          }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
          }else {
            this.currentState = this.currentState;
          }
      }
  }
