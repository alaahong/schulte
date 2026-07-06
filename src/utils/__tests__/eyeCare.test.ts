import { describe, expect, it } from 'vitest'
import {
  computeEyeCareBackground,
  computeEyeCareFilter,
  sanitizeEyeCareConfig
} from '../eyeCare'
import {
  EYE_CARE_BLUELIGHT_DEFAULT,
  EYE_CARE_BRIGHTNESS_DEFAULT,
  EYE_CARE_DEFAULTS,
  EYE_CARE_PRESETS,
  EYE_CARE_WARMTH_DEFAULT,
  type EyeCareConfig
} from '@/types'

describe('computeEyeCareFilter', () => {
  it('returns the expected filter for default config', () => {
    const f = computeEyeCareFilter(EYE_CARE_DEFAULTS)
    // brightness 95 → 0.5 + 0.95*0.5 = 0.975
    expect(f).toContain('brightness(0.975)')
    // warmth 60 → 0.6 * 0.4 = 0.24
    expect(f).toContain('sepia(0.240)')
    // warmth 60 → -12deg; blueLight 70 → -17.5deg; total -29.5
    expect(f).toContain('hue-rotate(-29.50deg)')
    // warmth 60 → 1 - 0.6*0.3 = 0.82
    expect(f).toContain('saturate(0.820)')
  })

  it('all-zeros yields pure brightness 0.5 with no color shifts', () => {
    const f = computeEyeCareFilter({ brightness: 0, warmth: 0, blueLight: 0 })
    expect(f).toBe('brightness(0.500) sepia(0.000) hue-rotate(0.00deg) saturate(1.000)')
  })

  it('all-100 yields maximum warm filter (strong blue cut + warm)', () => {
    const f = computeEyeCareFilter({ brightness: 100, warmth: 100, blueLight: 100 })
    expect(f).toContain('brightness(1.000)')
    expect(f).toContain('sepia(0.400)')
    // warmth -20 + blueLight -25 = -45
    expect(f).toContain('hue-rotate(-45.00deg)')
    expect(f).toContain('saturate(0.700)')
  })

  it('brightness slider 50..100 maps linearly to filter brightness 0.5..1.0', () => {
    for (const v of [50, 60, 75, 90, 100]) {
      const f = computeEyeCareFilter({ brightness: v, warmth: 0, blueLight: 0 })
      const expected = 0.5 + (v / 100) * 0.5
      expect(f).toContain(`brightness(${expected.toFixed(3)})`)
    }
  })

  it('warmth slider 0..100 maps to sepia 0..0.4', () => {
    for (const v of [0, 25, 50, 75, 100]) {
      const f = computeEyeCareFilter({ brightness: 100, warmth: v, blueLight: 0 })
      const expected = (v / 100) * 0.4
      expect(f).toContain(`sepia(${expected.toFixed(3)})`)
    }
  })

  it('blueLight slider adds hue-rotate independently of warmth', () => {
    const f = computeEyeCareFilter({ brightness: 100, warmth: 0, blueLight: 100 })
    // warmth 0 → 0deg; blueLight 100 → -25deg; total -25deg
    expect(f).toContain('hue-rotate(-25.00deg)')
  })

  it('clamps out-of-range inputs to [0..1]', () => {
    const tooHigh = computeEyeCareFilter({ brightness: 999, warmth: -50, blueLight: 200 })
    // -50 → 0; 999/100 → 1; 200/100 → 1
    expect(tooHigh).toContain('brightness(1.000)')
    expect(tooHigh).toContain('sepia(0.000)')
    expect(tooHigh).toContain('hue-rotate(-25.00deg)')
  })

  it('treats NaN / non-finite as 0', () => {
    const f = computeEyeCareFilter({ brightness: NaN, warmth: Infinity, blueLight: -Infinity })
    expect(f).toContain('brightness(0.500)')
    expect(f).toContain('sepia(0.000)')
    expect(f).toContain('hue-rotate(0.00deg)')
  })

  it('produces a valid CSS filter string for all preset combinations', () => {
    const presetList: EyeCareConfig[] = Object.values(EYE_CARE_PRESETS)
    for (const preset of presetList) {
      const f = computeEyeCareFilter(preset)
      expect(f).toMatch(/^brightness\(/)  // starts with brightness
      expect(f.split(' ')).toHaveLength(4) // 4 filter components
    }
  })
})

describe('computeEyeCareBackground', () => {
  it('returns a near-white background for light + low warmth', () => {
    const bg = computeEyeCareBackground({ brightness: 100, warmth: 0, blueLight: 0 }, false)
    expect(bg).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
    // 浅色基色 = (248, 250, 252) 不偏移
    expect(bg).toBe('rgb(248, 250, 252)')
  })

  it('shifts background toward warm cream for light + high warmth', () => {
    const bg = computeEyeCareBackground({ brightness: 100, warmth: 100, blueLight: 0 }, false)
    // warmth=1 → +0.2 R, +0.1 G, -0.1 B
    // r = round(248 + 255*0.2) = 299
    // g = round(250 + 255*0.1) = round(275.5) = 276
    // b = round(252 - 255*0.1) = round(226.5) = 227
    expect(bg).toBe('rgb(299, 276, 227)')
  })

  it('returns a near-black background for dark + low warmth', () => {
    const bg = computeEyeCareBackground({ brightness: 100, warmth: 0, blueLight: 0 }, true)
    expect(bg).toBe('rgb(15, 23, 42)')
  })

  it('shifts background toward dark warm for dark + high warmth', () => {
    const bg = computeEyeCareBackground({ brightness: 100, warmth: 100, blueLight: 0 }, true)
    // warmth=1 → +0.4 R, +0.3 G, +0.05 B
    // r = round(15 + 255*0.4) = round(117) = 117
    // g = round(23 + 255*0.3) = round(99.5) = 100
    // b = round(42 + 255*0.05) = round(54.75) = 55
    expect(bg).toBe('rgb(117, 100, 55)')
  })

  it('blueLight alone does NOT affect background color (only filter)', () => {
    const a = computeEyeCareBackground({ brightness: 100, warmth: 50, blueLight: 0 }, false)
    const b = computeEyeCareBackground({ brightness: 100, warmth: 50, blueLight: 100 }, false)
    expect(a).toBe(b)
  })
})

describe('sanitizeEyeCareConfig', () => {
  it('returns defaults for null / undefined / empty input', () => {
    expect(sanitizeEyeCareConfig(null)).toEqual(EYE_CARE_DEFAULTS)
    expect(sanitizeEyeCareConfig(undefined)).toEqual(EYE_CARE_DEFAULTS)
    expect(sanitizeEyeCareConfig({})).toEqual(EYE_CARE_DEFAULTS)
  })

  it('rounds and clamps each field to [0..100]', () => {
    expect(sanitizeEyeCareConfig({ brightness: -10, warmth: 150, blueLight: 50.7 }))
      .toEqual({ brightness: 0, warmth: 100, blueLight: 51 })
  })

  it('replaces non-numeric with default', () => {
    // @ts-expect-error testing runtime resilience
    const r = sanitizeEyeCareConfig({ brightness: 'abc', warmth: null, blueLight: 80 })
    expect(r.brightness).toBe(EYE_CARE_BRIGHTNESS_DEFAULT)
    expect(r.warmth).toBe(EYE_CARE_WARMTH_DEFAULT)
    expect(r.blueLight).toBe(80)
  })

  it('rounds to integers (avoid floating-point noise on UI sliders)', () => {
    const r = sanitizeEyeCareConfig({ brightness: 80.4, warmth: 60.6, blueLight: 50.5 })
    expect(r.brightness).toBe(80)
    expect(r.warmth).toBe(61)
    expect(r.blueLight).toBe(51)
  })

  it('uses the right per-field defaults when only some fields are bad', () => {
    // @ts-expect-error testing runtime resilience
    const r = sanitizeEyeCareConfig({ brightness: 'oops', warmth: 70, blueLight: NaN })
    expect(r.brightness).toBe(EYE_CARE_BRIGHTNESS_DEFAULT)
    expect(r.warmth).toBe(70)
    expect(r.blueLight).toBe(EYE_CARE_BLUELIGHT_DEFAULT)
  })
})

describe('EYE_CARE_PRESETS', () => {
  it('all presets have all 3 required fields within [0..100]', () => {
    const entries: Array<[string, EyeCareConfig]> = Object.entries(EYE_CARE_PRESETS)
    for (const [name, cfg] of entries) {
      expect(cfg.brightness, name).toBeGreaterThanOrEqual(0)
      expect(cfg.brightness, name).toBeLessThanOrEqual(100)
      expect(cfg.warmth, name).toBeGreaterThanOrEqual(0)
      expect(cfg.warmth, name).toBeLessThanOrEqual(100)
      expect(cfg.blueLight, name).toBeGreaterThanOrEqual(0)
      expect(cfg.blueLight, name).toBeLessThanOrEqual(100)
    }
  })

  it('night preset is warmer + more aggressive than day preset', () => {
    expect(EYE_CARE_PRESETS.night.warmth).toBeGreaterThan(EYE_CARE_PRESETS.day.warmth)
    expect(EYE_CARE_PRESETS.night.blueLight).toBeGreaterThan(EYE_CARE_PRESETS.day.blueLight)
  })
})
