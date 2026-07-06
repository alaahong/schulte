<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore, type AgeGroup, type Theme } from '@/stores/settings'
import { useHistoryStore } from '@/stores/history'
import { DEFAULT_PALETTE } from '@/utils/colorPalette'
import type { CellShape, CellStyle, Effect, SoundPack } from '@/types'
import { t, locale, setLocale, SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '@/i18n'

const router = useRouter()
const settings = useSettingsStore()
const history = useHistoryStore()

const themes = computed<Array<{ value: Theme; label: string; icon: string }>>(() => [
  { value: 'light', label: t('settings.themeLight'), icon: '☀️' },
  { value: 'dark',  label: t('settings.themeDark'),  icon: '🌙' },
  { value: 'auto',  label: t('settings.themeAuto'),  icon: '⚙️' }
])

const ageGroups = computed<Array<{ value: AgeGroup; label: string; desc: string }>>(() => [
  { value: '7-12',  label: t('age.7-12'),  desc: t('age.kid') },
  { value: '12-17', label: t('age.12-17'), desc: t('age.teen') },
  { value: '18+',   label: t('age.18+'),   desc: t('age.adult') }
])

const cellStyles = computed<Array<{ value: CellStyle; label: string; desc: string }>>(() => [
  { value: 'solid', label: t('styles.solid'), desc: t('styles.solidDesc') },
  { value: 'multi', label: t('styles.multi'), desc: t('styles.multiDesc') }
])

const cellShapes = computed<Array<{ value: CellShape; label: string; desc: string }>>(() => [
  { value: 'square',    label: t('shapes.square'),    desc: t('shapes.squareDesc') },
  { value: 'rounded',   label: t('shapes.rounded'),   desc: t('shapes.roundedDesc') },
  { value: 'circle',    label: t('shapes.circle'),    desc: t('shapes.circleDesc') },
  { value: 'irregular', label: t('shapes.irregular'), desc: t('shapes.irregularDesc') }
])

const soundPackOptions = computed<Array<{ value: SoundPack; label: string }>>(() => [
  { value: 'none',    label: t('settings.soundPack.none') },
  { value: 'classic', label: t('settings.soundPack.classic') },
  { value: 'bubu',    label: t('settings.soundPack.bubu') },
  { value: 'duang',   label: t('settings.soundPack.duang') },
  { value: 'gangan',  label: t('settings.soundPack.gangan') },
  { value: 'all',     label: t('settings.soundPack.all') }
])

const effectOptions = computed<Array<{ value: Effect; label: string }>>(() => [
  { value: 'none',  label: t('settings.effects.none') },
  { value: 'shake', label: t('settings.effects.shake') },
  { value: 'pop',   label: t('settings.effects.pop') },
  { value: 'burst', label: t('settings.effects.burst') },
  { value: 'all',   label: t('settings.effects.all') }
])

function toggleColor(id: string) {
  settings.togglePaletteColor(id)
}

function isColorSelected(id: string) {
  return settings.colorPalette.includes(id)
}

async function clearData() {
  if (confirm(t('common.confirm.clearHistory'))) {
    await history.clear()
  }
}

function changeLocale(e: Event) {
  const v = (e.target as HTMLSelectElement).value as Locale
  setLocale(v)
}
</script>

<template>
  <div class="flex-1 flex flex-col safe-top safe-bottom">
    <header class="px-5 pt-6 pb-3 flex items-center gap-2">
      <button class="btn-ghost !p-2" @click="router.push('/')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="text-xl font-bold">{{ t('settings.title') }}</h1>
    </header>

    <div class="flex-1 overflow-y-auto px-5 pb-8 space-y-6">
      <!-- 主题 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.theme') }}</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="th in themes"
            :key="th.value"
            @click="settings.theme = th.value"
            :class="['p-3 rounded-xl text-center transition-all border',
                     settings.theme === th.value
                       ? 'bg-primary-500 text-white border-primary-500'
                       : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800']"
          >
            <div class="text-xl">{{ th.icon }}</div>
            <div class="text-xs mt-1">{{ th.label }}</div>
          </button>
        </div>
      </section>

      <!-- 语言 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.language') }}</h2>
        <div class="card p-3">
          <select
            :value="locale"
            @change="changeLocale"
            class="w-full bg-transparent border-0 text-base font-medium focus:outline-none cursor-pointer"
          >
            <option v-for="l in SUPPORTED_LOCALES" :key="l" :value="l">{{ LOCALE_LABELS[l] }}</option>
          </select>
        </div>
      </section>

      <!-- 护眼 / 音效 / 视觉特效 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.behavior') }}</h2>
        <div class="card divide-y divide-slate-200 dark:divide-slate-800">
          <label class="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <div class="font-medium">{{ t('settings.eyeCare') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('settings.eyeCareDesc') }}</div>
            </div>
            <input type="checkbox" v-model="settings.eyeCare" class="w-5 h-5 accent-primary-500" />
          </label>
        </div>
      </section>

      <!-- 音效包 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.soundPack') }}</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">{{ t('settings.soundPackHint') }}</p>
        <div class="card p-3">
          <select
            v-model="settings.soundPack"
            class="w-full bg-transparent border-0 text-base font-medium focus:outline-none cursor-pointer"
          >
            <option v-for="o in soundPackOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>
      </section>

      <!-- 视觉特效 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.effects') }}</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">{{ t('settings.effectsHint') }}</p>
        <div class="card p-3">
          <select
            v-model="settings.effects"
            class="w-full bg-transparent border-0 text-base font-medium focus:outline-none cursor-pointer"
          >
            <option v-for="o in effectOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>
      </section>

      <!-- 年龄段 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.ageGroup') }}</h2>
        <div class="space-y-2">
          <button
            v-for="g in ageGroups"
            :key="g.value"
            @click="settings.ageGroup = g.value"
            :class="['w-full p-3 rounded-xl flex items-center justify-between transition-all border',
                     settings.ageGroup === g.value
                       ? 'bg-primary-500 text-white border-primary-500'
                       : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800']"
          >
            <span class="font-medium">{{ g.label }}</span>
            <span :class="['text-xs', settings.ageGroup === g.value ? 'text-white/80' : 'text-slate-500']">{{ g.desc }}</span>
          </button>
        </div>
      </section>

      <!-- 训练行为 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.behavior') }}</h2>
        <div class="card divide-y divide-slate-200 dark:divide-slate-800">
          <label class="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <div class="font-medium">{{ t('settings.strictMode') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('settings.strictModeDesc') }}</div>
            </div>
            <input type="checkbox" v-model="settings.strictMode" class="w-5 h-5 accent-primary-500" />
          </label>
          <label class="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <div class="font-medium">{{ t('settings.highlightOnClick') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('settings.highlightOnClickDesc') }}</div>
            </div>
            <input type="checkbox" v-model="settings.highlightOnClick" class="w-5 h-5 accent-primary-500" />
          </label>
          <label class="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <div class="font-medium">{{ t('settings.sound') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('settings.soundDesc') }}</div>
            </div>
            <input type="checkbox" v-model="settings.soundEnabled" class="w-5 h-5 accent-primary-500" />
          </label>
          <label class="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <div class="font-medium">{{ t('settings.haptic') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('settings.hapticDesc') }}</div>
            </div>
            <input type="checkbox" v-model="settings.hapticEnabled" class="w-5 h-5 accent-primary-500" />
          </label>
          <label class="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <div class="font-medium">{{ t('settings.centerDot') }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('settings.centerDotDesc') }}</div>
            </div>
            <input type="checkbox" v-model="settings.showCenterDot" class="w-5 h-5 accent-primary-500" />
          </label>
        </div>
      </section>

      <!-- 数字模式色块样式 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.cellStyle') }}</h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="s in cellStyles"
            :key="s.value"
            @click="settings.cellStyle = s.value"
            :class="['p-3 rounded-xl text-left transition-all border',
                     settings.cellStyle === s.value
                       ? 'bg-primary-500 text-white border-primary-500'
                       : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800']"
          >
            <div class="font-medium">{{ s.label }}</div>
            <div :class="['text-xs mt-0.5', settings.cellStyle === s.value ? 'text-white/80' : 'text-slate-500']">{{ s.desc }}</div>
          </button>
        </div>
      </section>

      <!-- 单元格形状 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.cellShape') }}</h2>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="s in cellShapes"
            :key="s.value"
            @click="settings.cellShape = s.value"
            :title="s.desc"
            :class="['aspect-square rounded-xl flex flex-col items-center justify-center transition-all border',
                     settings.cellShape === s.value
                       ? 'bg-primary-500 text-white border-primary-500'
                       : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800']"
          >
            <div
              :class="['w-8 h-8 mb-1 transition-all',
                       s.value === 'square' && 'rounded-lg bg-current opacity-80',
                       s.value === 'rounded' && 'rounded-2xl bg-current opacity-80',
                       s.value === 'circle' && 'rounded-full bg-current opacity-80',
                       s.value === 'irregular' && 'bg-current opacity-80',
                       settings.cellShape === s.value ? '!bg-white' : '']"
              :style="s.value === 'irregular' ? 'clip-path: polygon(20% 0, 100% 30%, 80% 100%, 0 70%); background: currentColor' : ''"
            />
            <div class="text-xs">{{ s.label }}</div>
          </button>
        </div>
      </section>

      <!-- 色彩模式调色板 -->
      <section>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ t('settings.palette') }}</h2>
          <button
            @click="settings.resetPalette"
            class="text-xs text-primary-500 hover:underline"
          >{{ t('settings.paletteReset') }}</button>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">{{ t('settings.paletteHint') }}</p>
        <div class="card p-4">
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="c in DEFAULT_PALETTE"
              :key="c.id"
              @click="toggleColor(c.id)"
              :title="isColorSelected(c.id) ? t('palette.selected', { name: c.name }) : t('palette.unselected', { name: c.name })"
              :class="[
                'aspect-square rounded-lg flex items-center justify-center text-white text-sm font-bold transition-all active:scale-90',
                isColorSelected(c.id)
                  ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900 scale-100 shadow-sm'
                  : 'opacity-30 scale-90 grayscale'
              ]"
              :style="{ backgroundColor: c.value }"
            >
              <span v-if="isColorSelected(c.id)">✓</span>
            </button>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
            {{ t('settings.paletteSelected', { sel: settings.colorPalette.length, total: DEFAULT_PALETTE.length }) }}
          </div>
        </div>
      </section>

      <!-- 数据 -->
      <section>
        <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('settings.data') }}</h2>
        <button class="card w-full p-4 text-left text-rose-500 font-medium" @click="clearData">
          {{ t('settings.clearHistory') }}
        </button>
      </section>

      <!-- 关于 -->
      <section>
        <button class="btn-ghost w-full" @click="router.push('/about')">
          {{ t('settings.aboutLink') }}
        </button>
      </section>
    </div>
  </div>
</template>

