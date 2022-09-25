import Singleton from "../Interface/Singleton";
import { ITile } from "../Levels";
import { TileManager } from "../Scripts/Tile/TileManager";

export class DataManager extends Singleton{
  mapInfo:Array<Array<ITile>>;
  mapRowCount:number;
  mapColumnCount:number;
  levelIndex:number=1;
  tileInfo:Array<Array<TileManager>>;
  static get Instance(){
    return super.GetInstance<DataManager>();
  }
  reset(){
    this.mapRowCount=0;
    this.mapColumnCount=0;
    this.mapInfo=[];
  }
}

