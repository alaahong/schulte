/**
 * 护眼模式计算工具(纯函数,无副作用)
 *
 * 职责:把 EyeCareConfig 转为 CSS 滤镜/背景色变量,供 settings store 写入
 * :root 元素。所有计算都封在这里以便单元测试覆盖。
 */
import type { EyeCareConfig } from '@/types'
import {
  EYE_CARE_BLUELIGHT_DEFAULT,
  EYE_CARE_BRIGHTNESS_DEFAULT,
  EYE_CARE_WARMTH_DEFAULT
} from '@/types'

/** 把 0..100 滑块值映射到 0..1 系数 */
function toUnit(v: number): number {
  if (!Number.isFinite(v)) return 0
  return Math.min(1, Math.max(0, v / 100))
}

/**
 * 计算滤镜字符串,可直接赋给 `filter` CSS 属性。
 * 组合顺序(从左到右逐层应用):
 *   brightness  → 降低整体亮度
 *   sepia       → 偏黄(暖色基调)
 *   hue-rotate  → 旋转色相,把蓝色推向暖色(叠加热度 + 蓝光过滤)
 *   saturate    → 略降饱和度,避免过艳
 *
 * 数值范围(对应滑块 0..100):
 *   brightness 0  → 50% 亮度
 *   brightness 100 → 100% 亮度
 *   warmth     0  → sepia 0, hue-rotate 0
 *   warmth     100 → sepia 0.4, hue-rotate -20deg
 *   blueLight  0  → 不叠加
 *   blueLight  100 → 额外 -25deg hue-rotate
 */
export function computeEyeCareFilter(cfg: EyeCareConfig): string {
  const b = toUnit(cfg.brightness)
  const w = toUnit(cfg.warmth)
  const bl = toUnit(cfg.blueLight)

  // 亮度:0..1 → 0.5..1.0
  const brightness = 0.5 + b * 0.5
  // 暖度
  const sepia = w * 0.4
  const hueFromWarmth = w * -20
  // 蓝光过滤(叠加)
  const hueFromBlue = bl * -25
  // 饱和度(暖度越高,饱和度越低,避免颜色刺眼)
  const saturate = 1 - w * 0.3

  return [
    `brightness(${brightness.toFixed(3)})`,
    `sepia(${sepia.toFixed(3)})`,
    `hue-rotate(${(hueFromWarmth + hueFromBlue).toFixed(2)}deg)`,
    `saturate(${saturate.toFixed(3)})`
  ].join(' ')
}

/**
 * 计算背景色。色温越暖,背景越偏黄/米色;深色模式同理。
 * - 浅色 + 冷 = 几乎纯白
 * - 浅色 + 暖 = 米黄
 * - 深色 + 冷 = 深蓝黑
 * - 深色 + 暖 = 深咖/深棕
 *
 * 用线性插值(RGB 通道分别 lerp)而不是 hue-rotate,
 * 避免背景滤镜与 .eye-care 的 filter 互相覆盖导致背景跳色。
 */
export function computeEyeCareBackground(
  cfg: EyeCareConfig,
  isDark: boolean
): string {
  const w = toUnit(cfg.warmth)
  // 暖色色温越高,背景越偏黄
  const warmR = isDark ? 0.4 : 0.2
  const warmG = isDark ? 0.3 : 0.1
  const warmB = isDark ? 0.05 : -0.1
  // 冷色基线
  const coolR = 0
  const coolG = 0
  const coolB = 0
  const rOff = coolR + (warmR - coolR) * w
  const gOff = coolG + (warmG - coolG) * w
  const bOff = coolB + (warmB - coolB) * w

  if (isDark) {
    // 深色基色 #0f172a (slate-900-ish),逐通道 lerp
    const r = Math.round((15 + 255 * rOff))
    const g = Math.round((23 + 255 * gOff))
    const b = Math.round((42 + 255 * bOff))
    return `rgb(${r}, ${g}, ${b})`
  } else {
    // 浅色基色 #f8fafc (slate-50-ish)
    const r = Math.round((248 + 255 * rOff))
    const g = Math.round((250 + 255 * gOff))
    const b = Math.round((252 + 255 * bOff))
    return `rgb(${r}, ${g}, ${b})`
  }
}

/** 缺省值,用于初始化或重置 */
export const EYE_CARE_DEFAULT_CONFIG: EyeCareConfig = {
  brightness: EYE_CARE_BRIGHTNESS_DEFAULT,
  warmth: EYE_CARE_WARMTH_DEFAULT,
  blueLight: EYE_CARE_BLUELIGHT_DEFAULT
}

/**
 * 把任意输入(可能来自 localStorage / URL)裁剪到合法区间。
 * 防止外部数据污染运行时状态。
 */
export function sanitizeEyeCareConfig(input: Partial<EyeCareConfig> | null | undefined): EyeCareConfig {
  const clamp = (v: number | undefined, fallback: number) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
    return Math.min(100, Math.max(0, Math.round(v)))
  }
  return {
    brightness: clamp(input?.brightness, EYE_CARE_BRIGHTNESS_DEFAULT),
    warmth: clamp(input?.warmth, EYE_CARE_WARMTH_DEFAULT),
    blueLight: clamp(input?.blueLight, EYE_CARE_BLUELIGHT_DEFAULT)
  }
}
