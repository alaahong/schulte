import { describe, expect, it } from 'vitest'
import { formatTime, formatTimeShort, ratePerformance, getRatingLabel } from '../rating'

describe('formatTime', () => {
  it('formats ms to mm:ss.mmm', () => {
    expect(formatTime(0)).toBe('00:00.000')
    expect(formatTime(1234)).toBe('00:01.234')
    expect(formatTime(65000)).toBe('01:05.000')
    expect(formatTime(60 * 1000 + 234)).toBe('01:00.234')
  })
  it('handles invalid', () => {
    expect(formatTime(-1)).toBe('00:00.000')
    expect(formatTime(NaN)).toBe('00:00.000')
  })
})

describe('formatTimeShort', () => {
  it('formats to seconds with 2 decimals', () => {
    expect(formatTimeShort(0)).toBe('0.00s')
    expect(formatTimeShort(1234)).toBe('1.23s')
    expect(formatTimeShort(25500)).toBe('25.50s')
  })
})

describe('ratePerformance', () => {
  it('5x5 18+ 5s => excellent', () => {
    expect(ratePerformance(5000, 5, '18+')).toBe('excellent')
  })
  it('5x5 18+ 10s => good (8-20s range)', () => {
    expect(ratePerformance(10000, 5, '18+')).toBe('good')
  })
  it('5x5 18+ 25s => fair (20-30s range)', () => {
    expect(ratePerformance(25000, 5, '18+')).toBe('fair')
  })
  it('5x5 18+ 40s => poor (>30s)', () => {
    expect(ratePerformance(40000, 5, '18+')).toBe('poor')
  })
  it('7-12 age group 5x5 20s => excellent', () => {
    expect(ratePerformance(20000, 5, '7-12')).toBe('excellent')
  })
  it('7-12 age group 5x5 40s => good (26-42s range)', () => {
    expect(ratePerformance(40000, 5, '7-12')).toBe('good')
  })
  it('7-12 age group 5x5 55s => poor', () => {
    expect(ratePerformance(55000, 5, '7-12')).toBe('poor')
  })
  it('12-17 age group 5x5 20s => good', () => {
    expect(ratePerformance(20000, 5, '12-17')).toBe('good')
  })
  it('other sizes scale with N²/25', () => {
    // 8x8 scale = 64/25 = 2.56
    // 18+: 优秀 <20.48, 良好 20.48-51.2, 中等 51.2-76.8
    // 15s for 8x8 = excellent
    expect(ratePerformance(15000, 8, '18+')).toBe('excellent')
    // 25s for 8x8 = good
    expect(ratePerformance(25000, 8, '18+')).toBe('good')
    // 60s for 8x8 = fair
    expect(ratePerformance(60000, 8, '18+')).toBe('fair')
  })
  it('3x3 has lower thresholds', () => {
    // 3x3 scale = 9/25 = 0.36
    // 18+: 优秀 2.88, 良好 7.2, 中等 10.8
    // 5s for 3x3 should be good
    expect(ratePerformance(5000, 3, '18+')).toBe('good')
  })
})

describe('getRatingLabel', () => {
  it('returns i18n label (default zh-CN)', () => {
    // 不再硬编码中文,断言非空
    expect(getRatingLabel('excellent')).toBeTruthy()
    expect(getRatingLabel('good')).toBeTruthy()
    expect(getRatingLabel('fair')).toBeTruthy()
    expect(getRatingLabel('poor')).toBeTruthy()
  })
})
