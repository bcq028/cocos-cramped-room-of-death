import { EnemyManager } from "../Interface/EnemyManager";
import Singleton from "../Interface/Singleton";
import { ITile } from "../Levels";
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManager } from "../Scripts/Player/PlayerManager";
import { TileManager } from "../Scripts/Tile/TileManager";
import { WoodenSkeletonManager } from "../Scripts/WoodenSkeleton/WoodenSkeletonManager";

export class DataManager extends Singleton{
  mapInfo:Array<Array<ITile>>;
  mapRowCount:number;
  mapColumnCount:number;
  levelIndex:number=1;
  tileInfo:Array<Array<TileManager>>;
  player:PlayerManager;
  enemies:EnemyManager[];
  door:DoorManager;
  static get Instance(){
    return super.GetInstance<DataManager>();
  }
  reset(){
    this.mapRowCount=0;
    this.mapColumnCount=0;
    this.mapInfo=[];
    this.player=null;
    this.enemies=[]
  }
}

