import { resources, SpriteFrame } from "cc";
import Singleton from "../Interface/Singleton";

export class ResourceManager extends Singleton{
  static get Instance(){
    return super.GetInstance<ResourceManager>();
  }
  loadDir(path:string,type=SpriteFrame){
    return new Promise<SpriteFrame[]>((resolve,reject)=>{
      resources.loadDir(path,type,(err,assets)=>{
        if(err){
          reject(err);
          return;
        }
        resolve(assets);
      });
    });
  }
}

