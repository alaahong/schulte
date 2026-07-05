import { describe, expect, it } from 'vitest'
import { ALL_COLOR_IDS, DEFAULT_PALETTE, getColorById, normalizePaletteIds } from '../colorPalette'

describe('colorPalette', () => {
  it('DEFAULT_PALETTE has 6 entries', () => {
    expect(DEFAULT_PALETTE).toHaveLength(6)
    DEFAULT_PALETTE.forEach((c) => {
      expect(c.id).toBeTruthy()
      expect(c.name).toBeTruthy()
      expect(c.value).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  it('ALL_COLOR_IDS matches DEFAULT_PALETTE ids', () => {
    expect(ALL_COLOR_IDS).toEqual(DEFAULT_PALETTE.map((c) => c.id))
  })

  it('getColorById finds existing colors', () => {
    expect(getColorById('red')?.value).toBe('#ef4444')
    expect(getColorById('blue')?.value).toBe('#3b82f6')
  })

  it('getColorById returns undefined for unknown', () => {
    expect(getColorById('magenta')).toBeUndefined()
  })

  describe('normalizePaletteIds', () => {
    it('returns ALL_COLOR_IDS for null/undefined/empty', () => {
      expect(normalizePaletteIds(null)).toEqual(ALL_COLOR_IDS)
      expect(normalizePaletteIds(undefined)).toEqual(ALL_COLOR_IDS)
      expect(normalizePaletteIds([])).toEqual(ALL_COLOR_IDS)
    })

    it('filters out unknown ids', () => {
      expect(normalizePaletteIds(['red', 'unknown', 'blue'])).toEqual(['red', 'blue'])
    })

    it('falls back to defaults when all ids are invalid', () => {
      expect(normalizePaletteIds(['unknown1', 'unknown2'])).toEqual(ALL_COLOR_IDS)
    })

    it('preserves valid ids and order', () => {
      expect(normalizePaletteIds(['blue', 'red'])).toEqual(['blue', 'red'])
    })
  })
})
