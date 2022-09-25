
import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UITransform, Layers } from 'cc';
const { ccclass, property } = _decorator;
import { DataManager } from '../../Runtime/DataManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
import { createUINode, randomByRange } from '../Utils';
import { TileManager } from './TileManager';

export const TILE_WIDTH=55;
export const TILE_HEIGHT=55;
@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init(){
    const spriteFrames=await ResourceManager.Instance.loadDir('texture/tile/tile',SpriteFrame)
    const {mapInfo}=DataManager.Instance;
    DataManager.Instance.tileInfo=[]
    for(let i=0;i<mapInfo.length;++i){
      DataManager.Instance.tileInfo[i]=[]
        const column=mapInfo[i]
        for(let j=0;j<column.length;++j){
          const item=column[j]
          if(item.src===null||item.type===null){
            continue;
          }
          let num=item.src
          if(i%2==0 && j%2==0 && (num==1||num==5||num==9)){
            num+=randomByRange(0,4);
          }
          const imageSrc=`tile (${item.src})`;
          const frame=spriteFrames.find(v=>v.name===imageSrc) || spriteFrames[0];
          const node=createUINode();
          const tileManager=node.addComponent(TileManager);
          const type=item.type;
          tileManager.init(type,frame,i,j);
          DataManager.Instance.tileInfo[i][j]=tileManager
          node.setParent(this.node);
        }
    }
  }
}

