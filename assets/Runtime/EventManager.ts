import Singleton from "../Interface/Singleton";
import { ITile } from "../Levels";
interface IItem{
  func:Function,
  ctx:unknown
}
export class EventManager extends Singleton{
  mapInfo:Array<Array<ITile>>;
  mapRowCount:number;
  mapColumnCount:number;
  static get Instance(){
    return super.GetInstance<EventManager>();
  }
  private eventDic:Map<string,Array<IItem>> =new Map();

  on(eventName:string,func:Function,ctx?:unknown){
    let prev=this.eventDic.get(eventName) || [];
    this.eventDic.set(eventName,[...prev,{func,ctx}]);
  }
  off(eventName:string,func:Function){
    let prev=this.eventDic.get(eventName) || [];
    let index=prev.findIndex(i=>i.func===func);
    index!==-1 && this.eventDic.get(eventName).splice(index,1);
  }
  emit(eventName:string,...params:unknown[]){
      this.eventDic.get(eventName)?.forEach(({func,ctx})=>{
        ctx?func.apply(ctx,params):func(...params);
      });
  }
  clear(){
    this.eventDic.clear();
  }
}

