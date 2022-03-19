import { _decorator, Component, Node, view, resources, SpriteFrame, UITransform, Vec2 } from 'cc'
import DataManager from '../../Runtime/DataManager'
import Levels, { ILevel } from '../../Levels'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../../Enum'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
import { createUINode } from '../../Utils'
import { TILE_HEIGHT, TILE_WIDTH } from '../TIle/TileManager'
import { PlayerManager } from '../Player/PlayerManager'
import { TileMapManager } from '../TIle/TileMapManager'

const { ccclass, property } = _decorator

const size = view.getVisibleSize()

// @ts-ignore
if (window.vConsole) {
  // @ts-ignore
  window.vConsole.$dom.style.display = 'none'
}

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: ILevel

  private stage: Node = null

  start() {
    this.generateStage()
    // resources.loadDir('texture/', SpriteFrame, (a, b) => {
    this.initLevel()
    // })
  }

  initLevel() {
    const level = Levels['level' + DataManager.Instance.levelIndex]
    if (level) {
      this.clearLevel()
      //生成新关卡数据
      this.level = level
      // //地图信息
      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0]?.length || 0
      this.generateTileMap()
      this.generatePlayer()
      this.generateEnemies()
    }
  }

  clearLevel() {
    this.stage.destroyAllChildren()
  }

  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  generateTileMap() {
    const node = createUINode()
    node.setParent(this.stage)
    node.addComponent(TileMapManager)
    this.adaptMapPos()
  }

  adaptMapPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 75
    this.stage.setPosition(-disX, disY)
  }

  generatePlayer() {
    const node = createUINode()
    node.setParent(this.stage)
    const playerManager = node.addComponent(PlayerManager)
    playerManager.init({
      x: 2,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER,
    })
    DataManager.Instance.player = playerManager
  }

  generateEnemies() {
    const node = createUINode()
    node.setParent(this.stage)
    const woodenSkeletonManager = node.addComponent(WoodenSkeletonManager)
    woodenSkeletonManager.init({
      x: 5,
      y: 2,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
    })
    DataManager.Instance.enemies.push(woodenSkeletonManager)
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }
}