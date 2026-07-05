import { describe, expect, it } from 'vitest'
import { generateColorGrid, generateGorbovGrid, generateNumberGrid, shuffle } from '../shuffle'

describe('shuffle', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr)).toHaveLength(5)
  })

  it('does not mutate original', () => {
    const arr = [1, 2, 3, 4, 5]
    const copy = [...arr]
    shuffle(arr)
    expect(arr).toEqual(copy)
  })

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    expect(shuffle(arr).sort()).toEqual([...arr].sort())
  })

  it('produces different orderings (statistical)', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i)
    const results = new Set(shuffle(arr).join(','))
    // 跑 10 次,期望至少出现 2 种不同结果
    for (let i = 0; i < 9; i++) results.add(shuffle(arr).join(','))
    expect(results.size).toBeGreaterThan(1)
  })
})

describe('generateNumberGrid', () => {
  it('generates n×n grid with 1..n²', () => {
    for (const n of [3, 4, 5, 6, 7, 8]) {
      const g = generateNumberGrid(n)
      expect(g).toHaveLength(n)
      g.forEach((row) => expect(row).toHaveLength(n))
      const all = g.flat()
      expect(all).toHaveLength(n * n)
      expect([...all].sort((a, b) => a - b)).toEqual(
        Array.from({ length: n * n }, (_, i) => i + 1)
      )
    }
  })
})

describe('generateGorbovGrid', () => {
  it('generates pairs with valid color', () => {
    for (const n of [3, 5, 8]) {
      const g = generateGorbovGrid(n)
      expect(g).toHaveLength(n * n)
      g.forEach((c) => {
        expect([c.value]).toBeTruthy()
        expect(['red', 'black']).toContain(c.color)
      })
    }
  })
})

describe('generateColorGrid', () => {
  it('generates valid color grid', () => {
    const g = generateColorGrid(5)
    expect(g).toHaveLength(25)
    g.forEach((c) => expect(typeof c).toBe('string'))
  })
})
