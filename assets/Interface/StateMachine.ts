
import { _decorator, Component, Node, Sprite, UITransform,Animation, AnimationClip, animation, SpriteFrame, sp} from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import State from './State';
import { SubStateMachine } from './SubStateMachine';


const { ccclass, property } = _decorator;


type ParamValueType=boolean|number;


export interface IParamValue{
  type:FSM_PARAM_TYPE_ENUM,
  value:ParamValueType
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
    private _currentState:State | SubStateMachine=null
    params:Map<string,IParamValue>=new Map();
    stateMachines:Map<string,State | SubStateMachine>=new Map();
    animationComponent:Animation;
    waittingList:Array<Promise<SpriteFrame[]>>=[];
    abstract  init():void;
    abstract run():void;

    get currentState(){
      return this._currentState;
    }
    set currentState(newState:State | SubStateMachine){
      this._currentState=newState;
      this.currentState.run();
    }

    getParams(paramsName:string){
        return this.params.get(paramsName)?.value;
    }

    setParams(paramsName:string,value:ParamValueType){
      if(!this.params.has(paramsName)){
        return;
      }
      this.params.get(paramsName).value=value;
      this.run();
      this.resetTrigger();
    }
    resetTrigger(){
      for(const [_,value] of this.params){
        if(value.type===FSM_PARAM_TYPE_ENUM.TRIGGER){
          value.value=false;
        }
      }
    }
}

export const getInitParamsTrigger=()=>{
  return {
    type:FSM_PARAM_TYPE_ENUM.TRIGGER,
    value:false
  }
}

export const getInitParamsNumber=()=>{
  return {
    type:FSM_PARAM_TYPE_ENUM.NUMBER,
    value:0
  };
}
