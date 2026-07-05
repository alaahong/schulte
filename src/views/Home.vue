<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { GRID_SIZES, type GameMode, type GridSize } from '@/types'
import { MODE_LABELS, MODE_DESCRIPTIONS } from '@/utils/mode'
import { formatTimeShort } from '@/utils/rating'
import { t } from '@/i18n'

const router = useRouter()
const history = useHistoryStore()

const selectedSize = ref<GridSize>(5)
const selectedMode = ref<GameMode>('asc')

onMounted(() => {
  history.loadAll()
})

const sizeOptions = computed(() => GRID_SIZES.map((n) => {
  const best = history.best(n, selectedMode.value)
  return {
    size: n,
    label: `${n}×${n}`,
    sub: best ? t('home.best', { time: formatTimeShort(best.durationMs) }) : t('home.noRecord')
  }
}))

const modeOptions = computed(() => (['asc', 'desc', 'alternating', 'gorbov', 'color'] as GameMode[]).map((m) => ({
  value: m,
  label: MODE_LABELS[m],
  desc: MODE_DESCRIPTIONS[m]
})))

function start() {
  router.push({
    name: 'play',
    params: { size: String(selectedSize.value) },
    query: { mode: selectedMode.value }
  })
}
</script>

<template>
  <div class="flex-1 safe-top safe-bottom flex flex-col">
    <!-- 顶部 -->
    <header class="px-5 pt-6 pb-3 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ t('app.title') }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ t('app.tagline') }}</p>
      </div>
      <div class="flex gap-1">
        <button class="btn-ghost !p-2" @click="router.push('/history')" :aria-label="t('home.history')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v18h18" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 14l4-4 4 4 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="btn-ghost !p-2" @click="router.push('/settings')" :aria-label="t('home.settings')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </header>

    <!-- 模式选择 -->
    <section class="px-5 mt-2">
      <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('home.modes') }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          v-for="opt in modeOptions"
          :key="opt.value"
          @click="selectedMode = opt.value"
          :class="[
            'rounded-xl p-3 text-left transition-all active:scale-95 border',
            selectedMode === opt.value
              ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary-300'
          ]"
        >
          <div class="font-medium text-sm">{{ opt.label }}</div>
          <div :class="['text-[11px] mt-0.5', selectedMode === opt.value ? 'text-white/80' : 'text-slate-500 dark:text-slate-400']">
            {{ opt.desc }}
          </div>
        </button>
      </div>
    </section>

    <!-- 网格大小 -->
    <section class="px-5 mt-5">
      <h2 class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('home.gridSize') }}</h2>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <button
          v-for="opt in sizeOptions"
          :key="opt.size"
          @click="selectedSize = opt.size"
          :class="[
            'rounded-xl py-3 text-center transition-all active:scale-95 border',
            selectedSize === opt.size
              ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary-300'
          ]"
        >
          <div class="text-lg font-bold">{{ opt.label }}</div>
          <div :class="['text-[11px] mt-0.5', selectedSize === opt.size ? 'text-white/80' : 'text-slate-500 dark:text-slate-400']">
            {{ opt.sub }}
          </div>
        </button>
      </div>
    </section>

    <!-- 开始按钮 -->
    <div class="mt-auto px-5 pb-6 pt-8">
      <button class="btn-primary w-full !py-4 !text-base shadow-lg shadow-primary-500/20" @click="start">
        {{ t('home.start') }}
      </button>
      <button class="btn-ghost w-full mt-2" @click="router.push('/about')">
        {{ t('home.about') }}
      </button>
    </div>
  </div>
</template>

