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

// 音效包(训练行为反馈音,默认 none 不发声音)
export const SOUND_PACKS = [
  'none',     // 无声
  'classic',  // 经典 beep
  'bubu',     // biu biu biu 高频短促
  'duang',    // duang duang duang 低频厚实
  'gangan',   // gang gang gang 中频明亮
  'all'       // 自动轮换使用以上所有包
] as const
export type SoundPack = typeof SOUND_PACKS[number]

// 视觉特效(点击正确时的动画,默认 none 不发特效)
export const EFFECTS = [
  'none',   // 无特效
  'shake',  // 轻微抖动
  'pop',    // 缩放弹出
  'burst',  // 粒子爆开
  'all'     // 同时启用以上所有
] as const
export type Effect = typeof EFFECTS[number]

// ─── 护眼模式增强配置 ────────────────────────────────────────
//
// 设计要点:
// - 三个正交参数(亮度 / 暖度 / 蓝光过滤)互不耦合,用户可独立调节
// - 范围均为 0..100,UI 上以滑块呈现,内部以 0..1 系数参与 CSS 计算
// - 提供 3 个常用预设 (day / night / reading) 作为快捷入口
// - 默认值为温和护眼,适合大多数场景;激进护眼请用 night 预设
//
// 与 CSS 滤镜的映射关系:
//   brightness ──► filter: brightness(0.5..1.0)
//   warmth     ──► filter: sepia(0..0.4)  +  hue-rotate(0..-20deg)  + saturate(1..0.7)
//   blueLight  ──► filter: hue-rotate(0..-25deg) 叠加在 warmth 之上
//
// 关于「与环境光相匹配」:
//   Web 平台无法直接读取设备 ambient light sensor;
//   但通过「跟随系统 dark/light」主题 + 用户手动微调亮度,已能覆盖 90% 场景。

/** 0..1;映射到 filter: brightness(0.5 + value * 0.5),0 = 50% 亮度,1 = 100% 亮度 */
export const EYE_CARE_BRIGHTNESS_MIN = 0
export const EYE_CARE_BRIGHTNESS_MAX = 100
export const EYE_CARE_BRIGHTNESS_DEFAULT = 95

/** 0..1;色温(暖度);0 = 自然白,1 = 偏黄最暖 */
export const EYE_CARE_WARMTH_MIN = 0
export const EYE_CARE_WARMTH_MAX = 100
export const EYE_CARE_WARMTH_DEFAULT = 60

/** 0..1;蓝光过滤强度;0 = 不过滤,1 = 强力过滤(显著降低 400-500nm 蓝光感知) */
export const EYE_CARE_BLUELIGHT_MIN = 0
export const EYE_CARE_BLUELIGHT_MAX = 100
export const EYE_CARE_BLUELIGHT_DEFAULT = 70

export interface EyeCareConfig {
  /** 0..100,UI 滑块值 */
  brightness: number
  /** 0..100,UI 滑块值 */
  warmth: number
  /** 0..100,UI 滑块值 */
  blueLight: number
}

export const EYE_CARE_DEFAULTS: EyeCareConfig = {
  brightness: EYE_CARE_BRIGHTNESS_DEFAULT,
  warmth: EYE_CARE_WARMTH_DEFAULT,
  blueLight: EYE_CARE_BLUELIGHT_DEFAULT
}

/** 常用预设 — 暴露给 UI 一键切换 */
export const EYE_CARE_PRESETS: { [k in 'day' | 'reading' | 'night']: EyeCareConfig } = {
  /** 白天:接近自然光,几乎无滤镜 */
  day:     { brightness: 100, warmth: 10,  blueLight: 10  },
  /** 夜间:强暖色 + 强蓝光过滤 */
  night:   { brightness: 80,  warmth: 80,  blueLight: 90  },
  /** 阅读:温和暖色,适度护眼 */
  reading: { brightness: 95,  warmth: 55,  blueLight: 60  }
}

export type EyeCarePreset = keyof typeof EYE_CARE_PRESETS
