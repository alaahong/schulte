/**
 * 轻量 i18n 中心
 * - 暴露 reactive `locale` ref + `t(key)` 函数
 * - 翻译资源从 ./locales 加载,支持回退到 zh-CN
 * - 不引入 vue-i18n,保持依赖最少
 */
import { ref, computed, reactive } from 'vue'
import { zhCN } from './locales/zh-CN'
import { enUS } from './locales/en-US'

export type Locale = 'zh-CN' | 'en-US'
export const SUPPORTED_LOCALES: Locale[] = ['zh-CN', 'en-US']
export const LOCALE_LABELS: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}

const STORAGE_KEY = 'schulte.locale.v1'
const ALL_TRANSLATIONS: Record<Locale, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

/** 探测浏览器语言 */
function detectLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'zh-CN' || raw === 'en-US') return raw
  } catch { /* ignore */ }
  const lang = (typeof navigator !== 'undefined' ? navigator.language : 'zh-CN').toLowerCase()
  if (lang.startsWith('en')) return 'en-US'
  return 'zh-CN'
}

const initial = detectLocale()
export const locale = ref<Locale>(initial)

const currentDict = computed<Record<string, string>>(() => ALL_TRANSLATIONS[locale.value] || ALL_TRANSLATIONS['zh-CN'])
const fallbackDict = ALL_TRANSLATIONS['zh-CN']

/**
 * 翻译函数:
 *   t('home.start')                -> 字符串
 *   t('play.target', { name: '1' }) -> 字符串(支持 {name} 占位)
 *   t('palette.red')                -> 字符串
 * 找不到 key 时回退到 zh-CN,再回退到 key 本身
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const raw = currentDict.value[key] ?? fallbackDict[key] ?? key
  if (!params) return raw
  return raw.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? String(params[k]) : `{${k}}`))
}

/** 切换语言 */
export function setLocale(next: Locale): void {
  locale.value = next
  try { localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
  // 同步 document.documentElement.lang
  if (typeof document !== 'undefined') {
    document.documentElement.lang = next
  }
}

/** 初始化(在 main.ts 中调用) */
export function initI18n(): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale.value
  }
}

/** useI18n composable,方便在 setup 中用解构 */
export function useI18n() {
  return {
    locale,
    setLocale,
    t,
    SUPPORTED_LOCALES,
    LOCALE_LABELS,
    // 用于 v-model 绑定
    state: reactive({ locale })
  }
}
