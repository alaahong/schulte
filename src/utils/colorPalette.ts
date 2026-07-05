/**
 * 色彩模式调色板定义
 * 用户可多选:默认全部 6 色
 * 颜色间区分度高(色相分散),便于色彩训练
 */
import { t as i18nT } from '@/i18n'

export interface PaletteColor {
  /** 唯一 id(用于持久化) */
  id: string
  /** 显示名(随当前 locale 变化) */
  name: string
  /** 实际颜色值 */
  value: string
}

/** 内置调色板基础信息(name 通过 i18n 动态取) */
interface PaletteBase {
  id: string
  i18nKey: 'red' | 'amber' | 'emerald' | 'blue' | 'violet' | 'pink'
  value: string
}
export const PALETTE_BASE: PaletteBase[] = [
  { id: 'red',     i18nKey: 'red',     value: '#ef4444' },
  { id: 'amber',   i18nKey: 'amber',   value: '#f59e0b' },
  { id: 'emerald', i18nKey: 'emerald', value: '#10b981' },
  { id: 'blue',    i18nKey: 'blue',    value: '#3b82f6' },
  { id: 'violet',  i18nKey: 'violet',  value: '#8b5cf6' },
  { id: 'pink',    i18nKey: 'pink',    value: '#ec4899' }
]

/** 构造一个随当前 locale 刷新的 PaletteColor(纯函数) */
export function buildPaletteColor(c: PaletteBase): PaletteColor {
  return { id: c.id, name: i18nT(`palette.${c.i18nKey}`), value: c.value }
}

/**
 * 完整调色板(Proxy 实现):
 * - 数字索引访问返回带 i18n name 的对象
 * - length / Array.prototype 方法 (map / forEach / filter / indexOf ...) 全部按 PALETTE_BASE 派发
 * - 这样消费方既可以 `DEFAULT_PALETTE.map(c => c.id)` 也能 `DEFAULT_PALETTE[0]`
 */
export const DEFAULT_PALETTE: PaletteColor[] = new Proxy([] as unknown as PaletteColor[], {
  get(_target, key) {
    if (key === 'length') return PALETTE_BASE.length
    // 数组方法
    if (typeof key === 'string') {
      const proto = Array.prototype as unknown as Record<string, unknown>
      if (proto[key] !== undefined) {
        const method = proto[key]
        if (typeof method === 'function') {
          return (...args: unknown[]) => {
            const materialized = PALETTE_BASE.map(buildPaletteColor)
            return (method as (...a: unknown[]) => unknown).apply(materialized, args)
          }
        }
      }
    }
    // 数字索引 / Symbol.iterator
    if (typeof key === 'string') {
      const idx = Number(key)
      if (Number.isInteger(idx) && idx >= 0 && idx < PALETTE_BASE.length) {
        return buildPaletteColor(PALETTE_BASE[idx])
      }
    }
    if (key === Symbol.iterator) {
      return function* () {
        for (const c of PALETTE_BASE) yield buildPaletteColor(c)
      }
    }
    return undefined
  },
  has(_target, key) {
    if (key === 'length') return true
    if (typeof key === 'string') {
      const idx = Number(key)
      if (Number.isInteger(idx) && idx >= 0 && idx < PALETTE_BASE.length) return true
    }
    return false
  }
})

/** 全部 id(默认) */
export const ALL_COLOR_IDS: string[] = PALETTE_BASE.map((c) => c.id)

/** 按 id 取颜色(返回带 i18n 名称的对象) */
export function getColorById(id: string): PaletteColor | undefined {
  const c = PALETTE_BASE.find((c) => c.id === id)
  if (!c) return undefined
  return buildPaletteColor(c)
}

/** 取颜色名(便捷方法) */
export function getColorName(id: string): string {
  return i18nT(`palette.${id}`)
}

/** 校验持久化的 id 列表,过滤掉不存在的(向前兼容) */
export function normalizePaletteIds(ids: string[] | undefined | null): string[] {
  if (!Array.isArray(ids) || ids.length === 0) return [...ALL_COLOR_IDS]
  const valid = ids.filter((id) => PALETTE_BASE.some((c) => c.id === id))
  return valid.length > 0 ? valid : [...ALL_COLOR_IDS]
}
