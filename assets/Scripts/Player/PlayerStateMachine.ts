
import { _decorator, Component, Node, Sprite, UITransform,Animation, AnimationClip, animation, SpriteFrame, sp} from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import State from '../../Interface/State';
import { EventManager } from '../../Runtime/EventManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';

const { ccclass, property } = _decorator;


type ParamValueType=boolean|number;


export interface IParamValue{
  type:FSM_PARAM_TYPE_ENUM,
  value:ParamValueType
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {

    private _currentState:State=null;

    params:Map<PARAMS_NAME_ENUM,IParamValue>=new Map();

    stateMachines:Map<PARAMS_NAME_ENUM,State>=new Map();

    animationComponent:Animation;

    waittingList:Array<Promise<SpriteFrame[]>>=[];
    get currentState(){
      return this._currentState;
    }
    set currentState(newState:State){
      this._currentState=newState;
      this.currentState.run();
    }

    getParams(paramsName:string){
        return this.params.get(paramsName as PARAMS_NAME_ENUM)?.value;
    }

    setParams(paramsName:PARAMS_NAME_ENUM,value:ParamValueType){
      if(!this.params.has(paramsName)){
        return;
      }
      this.params.get(paramsName).value=value;
      this.run();
    }
    async init(){
      this.animationComponent=this.addComponent(Animation);
      this.initParams();
      this.initStateMache();
      await Promise.all(this.waittingList);
    }
    initParams(){
      this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger());
      this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger());
    }
    initStateMache(){
      this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new State(this,'texture/player/idle/top',AnimationClip.WrapMode.Loop))
      this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,new State(this,'texture/player/turnleft/top'))
    }

    run(){
      switch(this.currentState){
        case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
        case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
          if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT)){
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
          }else if(this.params.get(PARAMS_NAME_ENUM.IDLE)){
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
          }
          break;
          default:
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
      }
    }
}

export const getInitParamsTrigger=()=>{
  return {
    type:FSM_PARAM_TYPE_ENUM.TRIGGER,
    value:false
  }
}
