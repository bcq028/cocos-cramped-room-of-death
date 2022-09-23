
import { _decorator, Component, Node } from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum';
import { EventManager } from '../../Runtime/EventManager';
const { ccclass, property } = _decorator;


@ccclass('ControllerManager')
export class ControllerManager extends Component {
    handleControl(ev:Event,type:string){
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL,type as CONTROLLER_ENUM);
    };

}

