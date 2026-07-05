import { describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'

describe('buildCells - number mode cellStyle / cellShape', () => {
  function setup() {
    setActivePinia(createPinia())
    const settings = useSettingsStore()
    const game = useGameStore()
    return { settings, game }
  }

  it('solid + square: cells have no bg / shape', () => {
    const { settings, game } = setup()
    settings.cellStyle = 'solid'
    settings.cellShape = 'square'
    game.newGame(5, 'asc')
    for (const c of game.grid) {
      expect(c.bg).toBeUndefined()
      expect(c.shape).toBeUndefined()
    }
  })

  it('multi: every cell has a bg drawn from the palette', () => {
    const { settings, game } = setup()
    settings.cellStyle = 'multi'
    settings.cellShape = 'square'
    settings.colorPalette = ['red', 'amber', 'blue']
    game.newGame(5, 'asc')
    const palette = ['#ef4444', '#f59e0b', '#3b82f6']
    for (const c of game.grid) {
      expect(c.bg).toBeDefined()
      expect(palette).toContain(c.bg)
    }
  })

  it('irregular: every cell has a shape drawn from 4 options', () => {
    const { settings, game } = setup()
    settings.cellStyle = 'solid'
    settings.cellShape = 'irregular'
    game.newGame(5, 'asc')
    const validShapes = new Set(['square', 'rounded', 'circle', 'irregular'])
    let seen = new Set<string>()
    for (const c of game.grid) {
      expect(c.shape).toBeDefined()
      expect(validShapes.has(c.shape as string)).toBe(true)
      seen.add(c.shape as string)
    }
    // 5x5 = 25 格,几乎肯定能覆盖到 4 种 shape
    expect(seen.size).toBeGreaterThanOrEqual(3)
  })

  it('multi + irregular can coexist on the same cell', () => {
    const { settings, game } = setup()
    settings.cellStyle = 'multi'
    settings.cellShape = 'irregular'
    game.newGame(5, 'asc')
    for (const c of game.grid) {
      expect(c.bg).toBeDefined()
      expect(c.shape).toBeDefined()
    }
  })
})
