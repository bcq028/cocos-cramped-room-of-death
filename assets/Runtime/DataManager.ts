import Singleton from "../Interface/Singleton";
import { ITile } from "../Levels";

export class DataManager extends Singleton{
  mapInfo:Array<Array<ITile>>;
  mapRowCount:number;
  mapColumnCount:number;
  levelIndex:number=1;
  static get Instance(){
    return super.GetInstance<DataManager>();
  }
  reset(){
    this.mapRowCount=0;
    this.mapColumnCount=0;
    this.mapInfo=[];
  }
}

