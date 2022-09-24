
import { _decorator,Animation, AnimationClip} from 'cc';
import {FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import State from '../../Interface/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Interface/StateMachine';
import IdleSubStateMachine from './substateMachine/IdleSubStateMachine';
import TurnLeftSubStateMachine from './substateMachine/TurnLeftSubStateMachine';

const { ccclass, property } = _decorator;


type ParamValueType=boolean|number;


export interface IParamValue{
  type:FSM_PARAM_TYPE_ENUM,
  value:ParamValueType
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
    async init(){
      this.animationComponent=this.addComponent(Animation);
      this.initParams();
      this.initStateMache();
      this.initAnimationEvent();
      await Promise.all(this.waittingList);
    }

    initParams(){
      this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger());
      this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger());
      this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber());
    }
    initStateMache(){
      this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new IdleSubStateMachine(this));
      this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this));
    }
    initAnimationEvent(){
      //包含turn的动画播放完后回到idle状态
      this.animationComponent.on(Animation.EventType.FINISHED,()=>{
        const name=this.animationComponent.defaultClip.name;
        const whiteList=['turn'];
        if(whiteList.some(v=>name.includes(v))){
          this.setParams(PARAMS_NAME_ENUM.IDLE,true);
        }
      })
    }

    run(){
      switch(this.currentState){
        case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
        case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
          if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
          }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
          }else {
            this.currentState=this.currentState;
          }
          break;
          default:
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
      }
    }
}
