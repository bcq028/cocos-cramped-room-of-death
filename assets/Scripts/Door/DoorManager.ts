
import { _decorator, Component, Node, Sprite, UITransform,Animation, AnimationClip, animation, SpriteFrame, sp, input} from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { EntityManager } from '../../Interface/EntityManager';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';

const { ccclass, property } = _decorator;

const ANIMATION_SPEED=1/8;

@ccclass('DoorManager')
export class DoorManager extends EntityManager {

    async init(){
        this.fsm=this.addComponent(DoorStateMachine);
        await this.fsm.init();
        super.init({
            x:7,
            y:8,
            type:ENTITY_TYPE_ENUM.DOOR,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        });
        EventManager.Instance.on(EVENT_ENUM.OPENDOOR,this.onOpen,this);
    }
    onOpen(){
      if(DataManager.Instance.enemies.every(enemy=>enemy.state===ENTITY_STATE_ENUM.DEATH) && this.state!==ENTITY_STATE_ENUM.DEATH){
        this.state=ENTITY_STATE_ENUM.DEATH;
      }
    }

}

