import { _decorator, Sprite, UITransform, Component } from "cc";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM, EVENT_ENUM, CONTROLLER_ENUM, ENTITY_TYPE_ENUM } from "../Enum";
import { IEntity } from "../Levels";
import { EventManager } from "../Runtime/EventManager";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";
import { TILE_WIDTH, TILE_HEIGHT } from "../Scripts/Tile/TileManager";
import { StateMachine } from "./StateMachine";
import {randomByLength} from '../Scripts/Utils/index'

const { ccclass, property } = _decorator;

const ANIMATION_SPEED=1/8;

@ccclass('EntityManager')
export class EntityManager extends Component {
    id:string=randomByLength(12);
    x=0;
    y=0;
    fsm:StateMachine;
    protected transform: UITransform;
    private _state: ENTITY_STATE_ENUM;
    private _direction: DIRECTION_ENUM;
    private type:ENTITY_TYPE_ENUM;
    get direction(){
        return this._direction;
    }
    set direction(newDirection:DIRECTION_ENUM){
        this._direction=newDirection;
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[this._direction]);
    }

    get state(){
        return this._state;
    }
    set state(newState:ENTITY_STATE_ENUM){
        this._state=newState;
        this.fsm.setParams(this._state,true);
    }

    init(params:IEntity){
        const sprite=this.addComponent(Sprite);
        sprite.sizeMode=Sprite.SizeMode.CUSTOM;
        const transform=this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4);

        this.x=params.x;
        this.y=params.y;
        this.direction=params.direction;
        this.state=params.state;
        this.type=params.type
    }

    update(){
        this.node.setPosition((this.x-1.5)*TILE_WIDTH,(-this.y+1.5)*TILE_HEIGHT)
    }

}

