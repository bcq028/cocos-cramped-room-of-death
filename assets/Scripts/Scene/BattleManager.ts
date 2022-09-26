
import { _decorator, Component, Node } from 'cc';
import { EVENT_ENUM } from '../../Enum';
import levels, { ILevel } from '../../Levels';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
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
        await woodenSkeletonManager.init();
        DataManager.Instance.enemies.push(woodenSkeletonManager);
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

