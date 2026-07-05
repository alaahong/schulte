/**
 * 核心类型定义
 */

// 训练模式
export type GameMode = 'asc' | 'desc' | 'alternating' | 'gorbov' | 'color' | 'custom'

// 符号类型
export type SymbolKind = 'number' | 'letter' | 'chinese' | 'emoji' | 'custom'

// 单元格外观
/** 多彩色块样式: solid=白底带边框(默认) / multi=每格从调色板取色 */
export type CellStyle = 'solid' | 'multi'
/** 单元格形状: square=圆角方 / rounded=更圆 / circle=正圆 / irregular=每格随机 */
export type CellShape = 'square' | 'rounded' | 'circle' | 'irregular'

// 网格单元
export interface Cell {
  row: number
  col: number
  /** 当前格显示的值:数字模式的数字 / 色彩模式的 hex */
  value: number | string
  /**
   * 颜色标识:
   * - 数字模式: undefined
   * - 色彩模式: 调色板 id(red/amber/blue...)
   * - 红黑模式: 'red' | 'black'
   */
  color?: string
  /** 已被点击完成(仅展示用) */
  completed?: boolean
  /** 上次点错时短暂高亮 */
  wrong?: boolean
  /** 多彩色块背景(hex),仅 cellStyle=multi 时使用 */
  bg?: string
  /** 单格独立形状,仅 cellShape=irregular 时使用 */
  shape?: 'square' | 'rounded' | 'circle' | 'irregular'
}

// 单次训练会话
export interface Session {
  id: string
  gridSize: number
  mode: GameMode
  symbolKind: SymbolKind
  startedAt: number
  finishedAt: number | null
  durationMs: number
  mistakes: number
  strictMode: boolean
  completed: boolean
  grid: Array<{ value: number | string; color?: string }>
  ageGroup: AgeGroup
  rating: Rating
}

// 成绩记录(持久化到 IndexedDB)
export interface Record {
  id: string
  sessionId: string
  gridSize: number
  mode: GameMode
  durationMs: number
  mistakes: number
  date: number
  rating: Rating
  ageGroup: AgeGroup
}

// 年龄段
export type AgeGroup = '7-12' | '12-17' | '18+'

// 评级
export type Rating = 'excellent' | 'good' | 'fair' | 'poor'

// 网格尺寸选项
export const GRID_SIZES = [3, 4, 5, 6, 7, 8] as const
export type GridSize = typeof GRID_SIZES[number]
