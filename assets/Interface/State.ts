import { animation, AnimationClip, AnimationComponent, Sprite, SpriteFrame } from 'cc'
import { ResourceManager } from '../Runtime/ResourceManager'
import { PlayerStateMachine } from '../Scripts/Player/PlayerStateMachine'
import { sortSpriteFrame } from '../Scripts/Utils'

/***
 * unit:milisecond
 */
export const ANIMATION_SPEED = 1 / 8

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default class State {
  private animationClip: AnimationClip
  constructor(
    private fsm: PlayerStateMachine,
    private spriteFrameDir: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed: number = ANIMATION_SPEED,
  ) {
    this.init()
  }

  async init() {
    //生成动画轨道属性
    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const waiting = ResourceManager.Instance.loadDir(this.spriteFrameDir, SpriteFrame)
    this.fsm.waittingList.push(waiting);
    const spriteFrames = await waiting
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [
      index * this.speed,
      item,
    ])
    track.channel.curve.assignSorted(frames)

    //动画添加轨道
    this.animationClip = new AnimationClip()
    this.animationClip.name = this.spriteFrameDir
    this.animationClip.duration = frames.length * this.speed
    this.animationClip.addTrack(track)
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    if(this.fsm.animationComponent.defaultClip?.name===this.animationClip.name){
      return;
    }
    this.fsm.animationComponent.defaultClip=this.animationClip;
    this.fsm.animationComponent.play();
  }
}
