/**
 * 模式相关工具:目标序列生成、模式判断
 */
import type { GameMode, Cell } from '@/types'
import { t as i18nT } from '@/i18n'

/**
 * 给定模式,返回每次应点击的目标序列(值)
 * 经典升序: 1, 2, 3, ...
 * 反向降序: N², N²-1, ...
 * 交替:     1, N², 2, N²-1, 3, N²-2, ...
 * Gorbov:    红 1, 黑 N², 红 2, 黑 N²-1, ...
 * 色彩:      颜色 1 → 颜色 2 → ... → 颜色 N(每轮各取一格,共 N²/N 轮)
 *
 * @param paletteForColor 色彩模式下用户选定的颜色 id 列表(顺序即轮转顺序)
 */
export function buildTargetSequence(
  mode: GameMode,
  total: number,
  _grid?: Cell[],
  paletteForColor: string[] = []
): Array<{ value: number | string; color?: 'red' | 'black' | string }> {
  switch (mode) {
    case 'asc':
      return Array.from({ length: total }, (_, i) => ({ value: i + 1 }))
    case 'desc':
      return Array.from({ length: total }, (_, i) => ({ value: total - i }))
    case 'alternating': {
      const seq: Array<{ value: number; color?: 'red' | 'black' }> = []
      let lo = 1, hi = total
      while (lo <= hi) {
        seq.push({ value: lo })
        if (lo !== hi) seq.push({ value: hi })
        lo++
        hi--
      }
      return seq
    }
    case 'gorbov': {
      const seq: Array<{ value: number; color: 'red' | 'black' }> = []
      let lo = 1, hi = total, turnRed = true
      while (lo <= hi) {
        seq.push({ value: lo, color: turnRed ? 'red' : 'black' })
        if (lo !== hi) seq.push({ value: hi, color: turnRed ? 'red' : 'black' })
        lo++
        hi--
        turnRed = !turnRed
      }
      return seq
    }
    case 'color': {
      // 色彩模式: 按 paletteForColor 顺序轮转,每轮每种颜色挑一格
      // 例如 palette=['red','blue','green'] 网格 9 格 → 每色 3 格
      // 目标: red, blue, green, red, blue, green, red, blue, green
      if (paletteForColor.length === 0) return []
      const seq: Array<{ value: string }> = []
      const rounds = Math.ceil(total / paletteForColor.length)
      for (let r = 0; r < rounds; r++) {
        for (const colorId of paletteForColor) {
          if (seq.length >= total) break
          seq.push({ value: colorId })
        }
      }
      return seq
    }
    default:
      return []
  }
}

/** 模式显示名称(从 i18n 读取,跟随当前 locale) */
export function getModeLabel(mode: GameMode): string {
  return i18nT(`modes.${mode}`)
}

/** 模式描述(从 i18n 读取) */
export function getModeDescription(mode: GameMode): string {
  return i18nT(`modes.${mode}Desc`)
}

/**
 * 兼容旧用法: 模板里直接 `MODE_LABELS[m]`
 * 改为 Proxy:返回 i18n 值,支持任意 GameMode key
 */
export const MODE_LABELS: Record<string, string> = new Proxy({} as Record<string, string>, {
  get(_t, key) {
    return i18nT(`modes.${String(key)}`)
  }
})

export const MODE_DESCRIPTIONS: Record<string, string> = new Proxy({} as Record<string, string>, {
  get(_t, key) {
    return i18nT(`modes.${String(key)}Desc`)
  }
})
