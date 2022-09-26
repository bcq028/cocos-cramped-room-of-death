
import { _decorator,Animation, AnimationClip} from 'cc';
import {ENTITY_STATE_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { EntityManager } from '../../Interface/EntityManager';
import State from '../../Interface/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Interface/StateMachine';
import AttackSubStateMachine from './substateMachine/AttackSubStateMachine';
import BlockBackSubStateMachine from './substateMachine/BlockBackSubStateMachine';
import BlockFrontSubStateMachine from './substateMachine/BlockFrontSubStateMachine';
import BlockFrontSubStateMache from './substateMachine/BlockFrontSubStateMachine';
import BlockLeftSubStateMachine from './substateMachine/BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './substateMachine/BlockRightSubStateMachine';
import BlockTurnLeftSubStateMachine from './substateMachine/BlockTurnLeftSubStateMachine';
import BlockTurnLeftSubStateMache from './substateMachine/BlockTurnLeftSubStateMachine';
import BlockTurnRightSubStateMachine from './substateMachine/BlockTurnRightSubStateMachine';
import DeathSubStateMachine from './substateMachine/DeathSubStateMachine';
import IdleSubStateMachine from './substateMachine/IdleSubStateMachine';
import TurnLeftSubStateMachine from './substateMachine/TurnLeftSubStateMachine';
import TurnRightSubStateMachine from './substateMachine/TurnRightSubStateMachine';

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
      this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.BLOCKBACK, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger())
      this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }
    initStateMache(){
      this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
      this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
      // this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this))
    }
    initAnimationEvent(){
      //包含turn的动画播放完后回到idle状态
      this.animationComponent.on(Animation.EventType.FINISHED,()=>{
        const name=this.animationComponent.defaultClip.name;
        const whiteList=['turn','block','attack'];
        if(whiteList.some(v=>name.includes(v))){
          this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.IDLE;
        }
      })
    }

    run() {
          if(!this.currentState){
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
          }
          if(this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
          } else if (this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH)
          } else if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
          } else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
          } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
          } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK)
          } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT)
          } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
          } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
          } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
          } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
          } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
          } else {
            this.currentState = this.currentState
          }
      }
  }
