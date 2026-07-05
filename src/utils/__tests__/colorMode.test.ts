import { describe, expect, it } from 'vitest'
import { buildTargetSequence } from '../mode'

describe('buildTargetSequence - color mode', () => {
  it('3 colors × 9 cells: each color appears 3 times in rotation', () => {
    const palette = ['red', 'blue', 'green']
    const seq = buildTargetSequence('color', 9, undefined, palette).map((t) => t.value)
    expect(seq).toEqual(['red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green'])
  })

  it('2 colors × 4 cells: alternates', () => {
    const palette = ['red', 'blue']
    const seq = buildTargetSequence('color', 4, undefined, palette).map((t) => t.value)
    expect(seq).toEqual(['red', 'blue', 'red', 'blue'])
  })

  it('4 colors × 8 cells: two full rounds', () => {
    const palette = ['a', 'b', 'c', 'd']
    const seq = buildTargetSequence('color', 8, undefined, palette).map((t) => t.value)
    expect(seq).toEqual(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd'])
  })

  it('3 colors × 10 cells: rounds = ceil(10/3) = 4, total length = 10', () => {
    const palette = ['a', 'b', 'c']
    const seq = buildTargetSequence('color', 10, undefined, palette).map((t) => t.value)
    expect(seq).toHaveLength(10)
    // 4 rounds × 3 = 12, but we only take 10: a,b,c,a,b,c,a,b,c,a
    expect(seq).toEqual(['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a'])
  })

  it('empty palette returns empty sequence', () => {
    const seq = buildTargetSequence('color', 9, undefined, [])
    expect(seq).toEqual([])
  })
})
