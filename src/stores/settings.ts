/**
 * 设置 Store:主题、年龄段、严苛模式、音效、特效、护眼模式、色彩训练配置
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { ALL_COLOR_IDS, normalizePaletteIds } from '@/utils/colorPalette'
import type { CellShape, CellStyle, Effect, SoundPack } from '@/types'
import { EYE_CARE_DEFAULTS, EYE_CARE_PRESETS, type EyeCareConfig, type EyeCarePreset } from '@/types'
import { computeEyeCareBackground, computeEyeCareFilter, sanitizeEyeCareConfig } from '@/utils/eyeCare'

export type Theme = 'light' | 'dark' | 'auto'
export type AgeGroup = '7-12' | '12-17' | '18+'

const STORAGE_KEY = 'schulte.settings.v1'

interface PersistedSettings {
  theme: Theme
  ageGroup: AgeGroup
  strictMode: boolean
  soundEnabled: boolean
  showCenterDot: boolean
  hapticEnabled: boolean
  keepAwake: boolean
  /** 色彩模式下用户挑选的颜色 id 列表(默认全部 6 色) */
  colorPalette: string[]
  /** 点击后是否高亮显示已点击格子 */
  highlightOnClick: boolean
  /** 单元格色块样式(默认 solid=纯色,可切 multi=多彩) */
  cellStyle: CellStyle
  /** 单元格形状(默认 square=圆角方,可切 rounded/circle/irregular) */
  cellShape: CellShape
  /** 护眼模式(暖色滤镜) */
  eyeCare: boolean
  /** 音效包(none/classic/bubu/duang/gangan/all),默认 none */
  soundPack: SoundPack
  /** 视觉特效(none/shake/pop/burst/all),默认 none */
  effects: Effect
  /** 护眼增强:三档滑块(亮度/暖度/蓝光过滤) */
  eyeCareConfig: EyeCareConfig
}

function loadSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...defaultSettings,
        ...parsed,
        colorPalette: normalizePaletteIds(parsed.colorPalette),
        eyeCareConfig: sanitizeEyeCareConfig(parsed.eyeCareConfig)
      }
    }
  } catch { /* ignore */ }
  return { ...defaultSettings }
}

const defaultSettings: PersistedSettings = {
  theme: 'auto',
  ageGroup: '18+',
  strictMode: true,
  soundEnabled: true,
  showCenterDot: false,
  hapticEnabled: true,
  keepAwake: false,
  colorPalette: [...ALL_COLOR_IDS],
  highlightOnClick: true,
  cellStyle: 'solid',
  cellShape: 'square',
  eyeCare: false,
  soundPack: 'none',
  effects: 'none',
  eyeCareConfig: { ...EYE_CARE_DEFAULTS }
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = loadSettings()

  const theme = ref<Theme>(initial.theme)
  const ageGroup = ref<AgeGroup>(initial.ageGroup)
  const strictMode = ref<boolean>(initial.strictMode)
  const soundEnabled = ref<boolean>(initial.soundEnabled)
  const showCenterDot = ref<boolean>(initial.showCenterDot)
  const hapticEnabled = ref<boolean>(initial.hapticEnabled)
  const keepAwake = ref<boolean>(initial.keepAwake)
  const colorPalette = ref<string[]>(initial.colorPalette)
  const highlightOnClick = ref<boolean>(initial.highlightOnClick)
  const cellStyle = ref<CellStyle>(initial.cellStyle)
  const cellShape = ref<CellShape>(initial.cellShape)
  const eyeCare = ref<boolean>(initial.eyeCare)
  const soundPack = ref<SoundPack>(initial.soundPack)
  const effects = ref<Effect>(initial.effects)
  const eyeCareConfig = ref<EyeCareConfig>(initial.eyeCareConfig)

  // 应用主题 + 护眼
  function applyTheme() {
    const root = document.documentElement
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
    root.classList.toggle('eye-care', eyeCare.value)

    // 动态写入护眼 CSS 变量(无论开关都写,关闭时写入中性值)
    if (eyeCare.value) {
      root.style.setProperty('--eye-care-filter', computeEyeCareFilter(eyeCareConfig.value))
      root.style.setProperty('--eye-care-body-bg', computeEyeCareBackground(eyeCareConfig.value, isDark))
    } else {
      // 关闭:恢复中性值,避免上次配置的暖色残留
      root.style.setProperty(
        '--eye-care-filter',
        'brightness(1) sepia(0) hue-rotate(0deg) saturate(1)'
      )
      root.style.setProperty('--eye-care-body-bg', isDark ? '#0f172a' : '#f8fafc')
    }

    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) meta.content = isDark ? '#0f172a' : '#0ea5e9'
  }

  // 切换调色板中某个颜色
  function togglePaletteColor(id: string) {
    const list = colorPalette.value
    const idx = list.indexOf(id)
    if (idx >= 0) {
      // 至少保留 2 种颜色才有意义
      if (list.length > 2) {
        colorPalette.value = list.filter((c) => c !== id)
      }
    } else {
      colorPalette.value = [...list, id]
    }
  }

  // 重置调色板为默认
  function resetPalette() {
    colorPalette.value = [...ALL_COLOR_IDS]
  }

  // 重置护眼配置为默认
  function resetEyeCare() {
    eyeCareConfig.value = { ...EYE_CARE_DEFAULTS }
  }

  // 一键应用预设
  function applyEyeCarePreset(preset: EyeCarePreset) {
    const p = EYE_CARE_PRESETS[preset]
    eyeCareConfig.value = { ...p }
  }

  // 持久化
  watch(
    [theme, ageGroup, strictMode, soundEnabled, showCenterDot, hapticEnabled, keepAwake, colorPalette, highlightOnClick, cellStyle, cellShape, eyeCare, soundPack, effects, eyeCareConfig],
    () => {
      const payload: PersistedSettings = {
        theme: theme.value,
        ageGroup: ageGroup.value,
        strictMode: strictMode.value,
        soundEnabled: soundEnabled.value,
        showCenterDot: showCenterDot.value,
        hapticEnabled: hapticEnabled.value,
        keepAwake: keepAwake.value,
        colorPalette: colorPalette.value,
        highlightOnClick: highlightOnClick.value,
        cellStyle: cellStyle.value,
        cellShape: cellShape.value,
        eyeCare: eyeCare.value,
        soundPack: soundPack.value,
        effects: effects.value,
        eyeCareConfig: { ...eyeCareConfig.value }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch { /* ignore */ }
      applyTheme()
    },
    { deep: true }
  )

  return {
    theme, ageGroup, strictMode, soundEnabled, showCenterDot, hapticEnabled, keepAwake,
    colorPalette, highlightOnClick, cellStyle, cellShape,
    eyeCare, soundPack, effects, eyeCareConfig,
    applyTheme, togglePaletteColor, resetPalette, resetEyeCare, applyEyeCarePreset
  }
})

