
import { _decorator, Component, Node, Sprite, UITransform,Animation, AnimationClip, animation, SpriteFrame, sp, input} from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { EntityManager } from '../../Interface/EntityManager';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';

const { ccclass, property } = _decorator;

const ANIMATION_SPEED=1/8;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {

    async init(){
        this.fsm=this.addComponent(WoodenSkeletonStateMachine);
        await this.fsm.init();
        super.init({
            x:2,
            y:4,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        });
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack,this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection,this);

        this.onChangeDirection(true);
    }
    onAttack(){
      const {x:PlayerX,y:PlayerY}=DataManager.Instance.player;
      if(
        (this.x===PlayerX&&Math.abs(this.y-PlayerY))
      ||( this.y===PlayerY && Math.abs(this.x-PlayerX))
      ){
        this.state=ENTITY_STATE_ENUM.ATTACK;
      }
    }
    onChangeDirection(init = false) {
      if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
        return
      }
      const { x: playerX, y: playerY } = DataManager.Instance.player
      const disX = Math.abs(playerX - this.x)
      const disY = Math.abs(playerY - this.y)

      //确保敌人在初始化的时候调整一次direction
      if (disX === disY && !init) {
        return
      }

      //第一象限
      if (playerX >= this.x && playerY <= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP

        //第二象限
      } else if (playerX <= this.x && playerY <= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP

        //第三象限
      } else if (playerX <= this.x && playerY >= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM

        //第四象限
      } else if (playerX >= this.x && playerY >= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
      }
    }

}

