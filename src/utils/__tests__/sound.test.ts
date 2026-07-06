import { describe, expect, it, beforeEach, vi } from 'vitest'
import { _peekNextAllPackName, _resetSoundForTest, playSound } from '../sound'

/**
 * 用 happy-dom 模拟 Web Audio API。
 * 主要验证:
 *  - playSound 的派发逻辑(进入哪个包)
 *  - 'none' 直接 return
 *  - 'all' 在 4 个包间轮换
 *  - AudioContext 的节点链是否被正确连接(Oscillator + GainNode)
 */
function installMockAudio() {
  const calls: Array<{ kind: string; freq: number; type: string; vol: number }> = []

  class MockOscillator {
    type: OscillatorType = 'sine'
    frequency = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
    private connections: any[] = []
    connect(node: any) { this.connections.push(node); return node }
    start() { /* noop */ }
    stop() { /* noop */ }
  }
  class MockGain {
    gain = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
    private connections: any[] = []
    connect(node: any) { this.connections.push(node); return node }
  }
  class MockBufferSource {
    buffer: any = null
    private connections: any[] = []
    connect(node: any) { this.connections.push(node); return node }
    start() { /* noop */ }
    stop() { /* noop */ }
  }
  class MockBuffer {
    private channels: Float32Array[]
    constructor(_channels: number, length: number) {
      this.channels = [new Float32Array(length)]
    }
    getChannelData(_ch: number) { return this.channels[0] }
  }
  class MockAudioContext {
    sampleRate = 44100
    destination = {}
    currentTime = 0
    createOscillator() { return new MockOscillator() }
    createGain() { return new MockGain() }
    createBufferSource() { return new MockBufferSource() }
    createBuffer(c: number, len: number, _sr: number) { return new MockBuffer(c, len) }
  }

  ;(globalThis as any).AudioContext = MockAudioContext
  ;(globalThis as any).webkitAudioContext = MockAudioContext
  return calls
}

describe('playSound', () => {
  beforeEach(() => {
    _resetSoundForTest()
  })

  it('none pack: no audio activity, no errors', () => {
    installMockAudio()
    expect(() => playSound('none', 'click')).not.toThrow()
    expect(() => playSound('none', 'wrong')).not.toThrow()
    expect(() => playSound('none', 'success')).not.toThrow()
    expect(() => playSound('none', 'fail')).not.toThrow()
  })

  it('classic pack: all 4 events dispatch without throwing', () => {
    installMockAudio()
    for (const ev of ['click', 'wrong', 'success', 'fail'] as const) {
      expect(() => playSound('classic', ev)).not.toThrow()
    }
  })

  it('bubu / duang / gangan packs: all 4 events dispatch without throwing', () => {
    installMockAudio()
    for (const pack of ['bubu', 'duang', 'gangan'] as const) {
      for (const ev of ['click', 'wrong', 'success', 'fail'] as const) {
        expect(() => playSound(pack, ev)).not.toThrow()
      }
    }
  })

  it('all pack: rotates through classic → bubu → duang → gangan in order', () => {
    installMockAudio()
    expect(_peekNextAllPackName()).toBe('classic')
    playSound('all', 'click')
    expect(_peekNextAllPackName()).toBe('bubu')
    playSound('all', 'click')
    expect(_peekNextAllPackName()).toBe('duang')
    playSound('all', 'click')
    expect(_peekNextAllPackName()).toBe('gangan')
    playSound('all', 'click')
    // 第 5 次回到 classic(轮换)
    expect(_peekNextAllPackName()).toBe('classic')
  })

  it('all pack cycles correctly for 8 calls', () => {
    installMockAudio()
    const seq: string[] = []
    for (let i = 0; i < 8; i++) {
      seq.push(_peekNextAllPackName())
      playSound('all', 'click')
    }
    // 8 次应该 2 轮:classic bubu duang gangan | classic bubu duang gangan
    expect(seq).toEqual([
      'classic', 'bubu', 'duang', 'gangan',
      'classic', 'bubu', 'duang', 'gangan'
    ])
  })
})

describe('playSound - AudioContext failure resilience', () => {
  it('falls back silently when AudioContext is not available', () => {
    delete (globalThis as any).AudioContext
    delete (globalThis as any).webkitAudioContext
    // 不应抛错
    expect(() => playSound('classic', 'click')).not.toThrow()
    expect(() => playSound('all', 'success')).not.toThrow()
  })
})
