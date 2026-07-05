import { describe, expect, it } from 'vitest'
import { buildTargetSequence, MODE_LABELS } from '../mode'

describe('buildTargetSequence', () => {
  it('asc generates 1..N', () => {
    expect(buildTargetSequence('asc', 9).map((t) => t.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('desc generates N..1', () => {
    expect(buildTargetSequence('desc', 9).map((t) => t.value)).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('alternating 1, N, 2, N-1 ...', () => {
    // total = 9 -> 1, 9, 2, 8, 3, 7, 4, 6, 5
    expect(buildTargetSequence('alternating', 9).map((t) => t.value)).toEqual([1, 9, 2, 8, 3, 7, 4, 6, 5])
    // total = 5 -> 1, 5, 2, 4, 3
    expect(buildTargetSequence('alternating', 5).map((t) => t.value)).toEqual([1, 5, 2, 4, 3])
  })

  it('gorbov alternates color per round', () => {
    const seq = buildTargetSequence('gorbov', 5)
    expect(seq).toHaveLength(5)
    expect(seq[0].color).toBe('red')
    expect(seq[0].value).toBe(1)
    expect(seq[1].color).toBe('red')
    expect(seq[1].value).toBe(5)
    expect(seq[2].color).toBe('black')
    expect(seq[2].value).toBe(2)
  })
})

describe('MODE_LABELS', () => {
  it('contains all modes (i18n proxy)', () => {
    // 默认 locale = zh-CN,具体值由 t() 给出
    expect(MODE_LABELS.asc).toBeTruthy()
    expect(MODE_LABELS.desc).toBeTruthy()
    expect(MODE_LABELS.alternating).toBeTruthy()
    expect(MODE_LABELS.gorbov).toBeTruthy()
    expect(MODE_LABELS.color).toBeTruthy()
    // proxy 支持任意 GameMode key
    expect(MODE_LABELS.zzz_unknown).toBeTruthy()
  })
})
