
import { _decorator, Component, Node } from 'cc';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import levels, { ILevel } from '../../Levels';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { PlayerManager } from '../Player/PlayerManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../Utils';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';

const { ccclass, property } = _decorator;



@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel;
    stage:Node;
    onLoad(){
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this);
    }
    onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel);
    }
    start () {
        this.generateStage();
        this.initLevel();
        this.generateTileMap();
        this.generatePlayer();
        this.generateEnemies();
        this.generateDoor();
    }
    initLevel(){
        const level=levels[`level${DataManager.Instance.levelIndex}`];
        if(level){
            this.clearLevel();
            this.level=level;
            DataManager.Instance.mapInfo=this.level.mapInfo;
            DataManager.Instance.mapRowCount=this.level.mapInfo.length || 0;
            DataManager.Instance.mapColumnCount=this.level.mapInfo[0].length || 0;
        }
    }
    generateStage(){
        this.stage=createUINode();
        this.stage.setParent(this.node);
    }
    generateTileMap(){
        const tileMap=createUINode();
        tileMap.setParent(this.stage);
        const tileMapManager=tileMap.addComponent(TileMapManager);
        tileMapManager.init();
        this.adaptPos();
    }
    async generateDoor(){
        const node=createUINode();
        node.setParent(this.stage);
        const doorManager=node.addComponent(DoorManager);
        await doorManager.init();
        DataManager.Instance.door=doorManager;
    }
    async generatePlayer(){
        const node=createUINode();
        node.setParent(this.stage);
        const playerManager=node.addComponent(PlayerManager);
        await playerManager.init();
        DataManager.Instance.player=playerManager;
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true);
    }
    async generateEnemies(){
        const enemy=createUINode();
        enemy.setParent(this.stage);
        const woodenSkeletonManager=enemy.addComponent(WoodenSkeletonManager);
        await woodenSkeletonManager.init(
            {
                x:2,
                y:4,
                type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
                direction:DIRECTION_ENUM.TOP,
                state:ENTITY_STATE_ENUM.IDLE
            }
        );
        DataManager.Instance.enemies.push(woodenSkeletonManager);
        const enemy2=createUINode();
        enemy2.setParent(this.stage);
        const ironSkeletonManager=enemy2.addComponent(IronSkeletonManager);
        await ironSkeletonManager.init(
            {
                x:2,
                y:2,
                type:ENTITY_TYPE_ENUM.SKELETON_IRON,
                direction:DIRECTION_ENUM.TOP,
                state:ENTITY_STATE_ENUM.IDLE
            }
        );
        DataManager.Instance.enemies.push(ironSkeletonManager);
    }
    adaptPos(){
        const {mapRowCount,mapColumnCount}=DataManager.Instance;
        const disX=(TILE_WIDTH*mapRowCount)/2;
        const disY=(TILE_HEIGHT*mapColumnCount )/2+70;
        this.stage.setPosition(-disX,disY);
    }
    nextLevel(){
        DataManager.Instance.levelIndex++;
        this.initLevel();
    }
    clearLevel(){
        this.stage.destroyAllChildren();
        DataManager.Instance.reset();
    }
}

