
import { _decorator, Component, Node, Sprite, UITransform,Animation, AnimationClip, animation, SpriteFrame, sp} from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { EventManager } from '../../Runtime/EventManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { PlayerStateMachine } from './PlayerStateMachine';

const { ccclass, property } = _decorator;

const ANIMATION_SPEED=1/8;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
    x=0;
    y=0;
    targetX=0;
    targetY=0;
    fsm:PlayerStateMachine;
    private readonly speed=1/10;
    
    async init(){
        const sprite=this.addComponent(Sprite);
        sprite.sizeMode=Sprite.SizeMode.CUSTOM;
        const transform=this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4);

        this.fsm=this.addComponent(PlayerStateMachine);
        await this.fsm.init();

        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true);

        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this);
    }
    update(){
        this.updateXY();
        this.node.setPosition((this.x-1.5)*TILE_WIDTH,(-this.y+1.5)*TILE_HEIGHT)
    }
    move(inputDirection:CONTROLLER_ENUM){
        if(inputDirection===CONTROLLER_ENUM.TOP){
            this.targetY-=1;
        }else if(inputDirection===CONTROLLER_ENUM.BOTTOM){
            this.targetY+=1;
        }else if(inputDirection===CONTROLLER_ENUM.LEFT){
            this.targetX-=1;
        }else if(inputDirection===CONTROLLER_ENUM.RIGHT){
            this.targetX+=1;
        }else if(inputDirection===CONTROLLER_ENUM.TURNLEFT){
            this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT,true);
        }
    }
    updateXY(){
        if(Math.abs(this.targetX-this.x)<=0.1&&Math.abs(this.targetY-this.y)<=0.1){
            this.x=this.targetX;
            this.y=this.targetY;
            return;
        }
        if(this.targetX<this.x){
            this.x-=this.speed;
        }else{
            this.x+=this.speed
        }
        if(this.targetY<this.y){
            this.y-=this.speed;
        }else{
            this.y+=this.speed;
        }
    }
}

