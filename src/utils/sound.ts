/**
 * 音效包:用 Web Audio 合成各包音效,无外部资源依赖
 *
 * 5 个包:
 *  - classic: 经典短 beep
 *  - bubu:    biu biu biu — 高频短促上扬
 *  - duang:   duang duang duang — 低频厚实带回响
 *  - gangan:  gang gang gang — 中频明亮的两声
 *  - all:     自动轮换使用上述 4 个包(按调用序号 % 4)
 *
 * 4 个事件:
 *  - click:   点击正确
 *  - wrong:   点击错误
 *  - success: 全部完成
 *  - fail:    严苛模式结束
 */
import type { SoundPack } from '@/types'

type Event = 'click' | 'wrong' | 'success' | 'fail'

// 让类型不依赖 Vue 运行时
export type SoundEvent = Event

let audioCtx: AudioContext | null = null

function ctx(): AudioContext | null {
  if (audioCtx) return audioCtx
  try {
    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!Ctor) return null
    audioCtx = new Ctor()
    return audioCtx
  } catch {
    return null
  }
}

// 通用单音发生器
function tone(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.08
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = vol
  osc.connect(gain).connect(ctx.destination)
  const t0 = ctx.currentTime + startOffset
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.start(t0)
  osc.stop(t0 + duration)
}

// 上滑音(频率从 a 滑到 b)
function sweep(
  ctx: AudioContext,
  a: number,
  b: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = 'sine',
  vol = 0.08
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  const t0 = ctx.currentTime + startOffset
  osc.frequency.setValueAtTime(a, t0)
  osc.frequency.exponentialRampToValueAtTime(Math.max(b, 1), t0 + duration)
  gain.gain.value = vol
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duration)
}

// 噪声 burst(用于 duang 的回响)
function noiseBurst(
  ctx: AudioContext,
  startOffset: number,
  duration: number,
  vol = 0.05
) {
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
  }
  const src = ctx.createBufferSource()
  const gain = ctx.createGain()
  src.buffer = buffer
  gain.gain.value = vol
  src.connect(gain).connect(ctx.destination)
  src.start(ctx.currentTime + startOffset)
  src.stop(ctx.currentTime + startOffset + duration)
}

// ─── 各包实现 ────────────────────────────────────────────

function playClassic(ev: Event) {
  const c = ctx(); if (!c) return
  switch (ev) {
    case 'click':   tone(c, 660, 0,    0.06, 'triangle', 0.06); break
    case 'wrong':   tone(c, 220, 0,    0.18, 'sawtooth', 0.08); break
    case 'success':
      tone(c, 523, 0,    0.1,  'triangle', 0.08)
      tone(c, 784, 0.11, 0.16, 'triangle', 0.08)
      break
    case 'fail':    tone(c, 180, 0,    0.4,  'sawtooth', 0.1); break
  }
}

function playBubu(ev: Event) {
  // biu biu biu: 1200→1600→2000Hz 上滑,短促
  const c = ctx(); if (!c) return
  switch (ev) {
    case 'click':
      sweep(c, 1200, 1900, 0,    0.07, 'square', 0.05)
      break
    case 'wrong':
      sweep(c, 800, 400, 0, 0.18, 'square', 0.07)
      break
    case 'success':
      sweep(c, 1200, 1900, 0,    0.07, 'square', 0.06)
      sweep(c, 1300, 2000, 0.09, 0.07, 'square', 0.06)
      sweep(c, 1400, 2200, 0.18, 0.1,  'square', 0.07)
      break
    case 'fail':
      sweep(c, 600, 200, 0, 0.35, 'square', 0.08)
      break
  }
}

function playDuang(ev: Event) {
  // duang: 低频厚实,主音 + 二次谐波 + 噪声 burst
  const c = ctx(); if (!c) return
  switch (ev) {
    case 'click':
      tone(c, 120, 0, 0.18, 'sine',     0.18)
      tone(c, 240, 0, 0.18, 'sine',     0.08)
      noiseBurst(c, 0, 0.15, 0.04)
      break
    case 'wrong':
      tone(c, 90,  0, 0.25, 'sine',     0.18)
      tone(c, 180, 0, 0.25, 'sine',     0.08)
      noiseBurst(c, 0, 0.22, 0.05)
      break
    case 'success':
      tone(c, 130, 0,    0.22, 'sine', 0.2)
      tone(c, 260, 0,    0.22, 'sine', 0.1)
      noiseBurst(c, 0,   0.18, 0.05)
      tone(c, 145, 0.26, 0.22, 'sine', 0.2)
      tone(c, 290, 0.26, 0.22, 'sine', 0.1)
      noiseBurst(c, 0.26, 0.18, 0.05)
      tone(c, 165, 0.52, 0.4,  'sine', 0.22)
      tone(c, 330, 0.52, 0.4,  'sine', 0.12)
      noiseBurst(c, 0.52, 0.35, 0.06)
      break
    case 'fail':
      tone(c, 75, 0, 0.5, 'sine', 0.22)
      tone(c, 150, 0, 0.5, 'sine', 0.1)
      noiseBurst(c, 0, 0.45, 0.05)
      break
  }
}

function playGangan(ev: Event) {
  // gang gang gang: 中频明亮(880Hz,square 短),2 声
  const c = ctx(); if (!c) return
  switch (ev) {
    case 'click':
      tone(c, 880, 0,    0.05, 'square', 0.06)
      tone(c, 880, 0.06, 0.05, 'square', 0.06)
      break
    case 'wrong':
      tone(c, 200, 0, 0.2, 'square', 0.07)
      break
    case 'success':
      tone(c, 880, 0,    0.06, 'square', 0.07)
      tone(c, 880, 0.08, 0.06, 'square', 0.07)
      tone(c, 1320, 0.18, 0.18, 'square', 0.08)
      break
    case 'fail':
      tone(c, 200, 0,    0.2,  'square', 0.08)
      tone(c, 140, 0.22, 0.3,  'square', 0.08)
      break
  }
}

// 'all' 包: 4 个包按调用顺序轮换
const allPool: Array<(ev: Event) => void> = [playClassic, playBubu, playDuang, playGangan]
let allCursor = 0
function playAll(ev: Event) {
  const fn = allPool[allCursor % allPool.length]
  allCursor++
  fn(ev)
}

// ─── 统一入口 ────────────────────────────────────────────

const dispatch: Record<Exclude<SoundPack, 'none' | 'all'>, (ev: Event) => void> = {
  classic: playClassic,
  bubu: playBubu,
  duang: playDuang,
  gangan: playGangan
}

/**
 * 播放一个音效事件。
 * @param pack 当前 soundPack 设置;'none' 不发声;'all' 自动轮换
 * @param ev   事件类型
 */
export function playSound(pack: SoundPack, ev: Event): void {
  if (pack === 'none') return
  if (pack === 'all') {
    playAll(ev)
    return
  }
  dispatch[pack](ev)
}

/** 测试用:重置内部状态(AudioContext 仍保留) */
export function _resetSoundForTest() {
  allCursor = 0
}

/** 测试用:取下一个 'all' 包名(仅用于单元测试,不会真发声) */
export function _peekNextAllPackName(): string {
  return ['classic', 'bubu', 'duang', 'gangan'][allCursor % 4]
}
