import { _decorator } from "cc"
import { EVENT_ENUM, ENTITY_STATE_ENUM } from "../../Enum"
import { EnemyManager } from "../../Interface/EnemyManager"
import { IEntity } from "../../Levels"
import { DataManager } from "../../Runtime/DataManager"
import { EventManager } from "../../Runtime/EventManager"
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine"
const { ccclass } = _decorator
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }

  onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }

    const { targetX: playerX, targetY: playerY, state: playerState } = DataManager.Instance.player
    if (
      ((playerX === this.x && Math.abs(playerY - this.y) <= 1) ||
        (playerY === this.y && Math.abs(playerX - this.x) <= 1)) &&
      playerState !== ENTITY_STATE_ENUM.DEATH &&
      playerState !== ENTITY_STATE_ENUM.AIRDEATH
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
