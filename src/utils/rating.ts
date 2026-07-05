/**
 * 时间格式化与评级
 */
import type { AgeGroup, Rating } from '@/types'
import { t as i18nT } from '@/i18n'

/** 毫秒 → mm:ss.mmm */
export function formatTime(ms: number): string {
  if (!isFinite(ms) || ms < 0) return '00:00.000'
  const totalSec = ms / 1000
  const min = Math.floor(totalSec / 60)
  const sec = Math.floor(totalSec % 60)
  const milli = Math.floor(ms % 1000)
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(milli).padStart(3, '0')}`
}

/** 毫秒 → 简短格式 (例如 "23.45s") */
export function formatTimeShort(ms: number): string {
  if (!isFinite(ms) || ms < 0) return '--'
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * 评级阈值(基于 5×5 标准,其他尺寸按 N²/25 等比缩放)
 * 单位:秒
 */
const RATING_TABLE: Record<AgeGroup, { excellent: number; good: number; fair: number }> = {
  '7-12':  { excellent: 26, good: 42, fair: 50 },
  '12-17': { excellent: 16, good: 26, fair: 36 },
  '18+':   { excellent: 8,  good: 20, fair: 30 }
}

const RATING_LABEL: Record<Rating, string> = new Proxy({} as Record<Rating, string>, {
  get(_t, key) {
    return i18nT(`rating.${String(key)}`)
  }
})

const RATING_COLOR: Record<Rating, string> = {
  excellent: 'text-emerald-500',
  good: 'text-sky-500',
  fair: 'text-amber-500',
  poor: 'text-rose-500'
}

/**
 * 根据年龄段、网格大小、耗时计算评级
 */
export function ratePerformance(
  durationMs: number,
  gridSize: number,
  ageGroup: AgeGroup
): Rating {
  const base = RATING_TABLE[ageGroup]
  // 等比缩放:5×5 为基准,其他尺寸按 (N²/25) 调整
  const scale = (gridSize * gridSize) / 25
  const sec = durationMs / 1000
  if (sec <= base.excellent * scale) return 'excellent'
  if (sec <= base.good * scale) return 'good'
  if (sec <= base.fair * scale) return 'fair'
  return 'poor'
}

export function getRatingLabel(r: Rating): string { return RATING_LABEL[r] }
export function getRatingColor(r: Rating): string { return RATING_COLOR[r] }
