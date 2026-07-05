<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { GRID_SIZES, type GameMode, type GridSize } from '@/types'
import { MODE_LABELS } from '@/utils/mode'
import { formatTimeShort, getRatingColor, getRatingLabel } from '@/utils/rating'
import { t, locale } from '@/i18n'

const router = useRouter()
const history = useHistoryStore()

const filterSize = ref<GridSize | 'all'>('all')
const filterMode = ref<GameMode | 'all'>('all')

onMounted(() => {
  history.loadAll()
})

const filtered = computed(() => {
  return history.records.filter((r) => {
    if (filterSize.value !== 'all' && r.gridSize !== filterSize.value) return false
    if (filterMode.value !== 'all' && r.mode !== filterMode.value) return false
    return true
  })
})

function clear() {
  if (confirm(t('common.confirm.clearHistory'))) {
    history.clear()
  }
}

const dateLocale = computed(() => locale.value === 'en-US' ? 'en-US' : 'zh-CN')
</script>

<template>
  <div class="flex-1 flex flex-col safe-top safe-bottom">
    <header class="px-5 pt-6 pb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button class="btn-ghost !p-2" @click="router.push('/')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">{{ t('history.title') }}</h1>
      </div>
      <button v-if="filtered.length > 0" class="btn-ghost text-rose-500 !px-3" @click="clear">{{ t('history.clear') }}</button>
    </header>

    <!-- 筛选 -->
    <div class="px-5 space-y-2 mb-3">
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          v-for="opt in [{v:'all',l:t('common.all')}, ...GRID_SIZES.map(s => ({v:s,l:s+'×'+s}))]"
          :key="String(opt.v)"
          @click="filterSize = opt.v as any"
          :class="['px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                   filterSize === opt.v ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200']"
        >{{ opt.l }}</button>
      </div>
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          v-for="opt in [{v:'all',l:t('common.allModes')}, ...Object.entries(MODE_LABELS).map(([k,l]) => ({v:k,l}))]"
          :key="String(opt.v)"
          @click="filterMode = opt.v as any"
          :class="['px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                   filterMode === opt.v ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200']"
        >{{ opt.l }}</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="flex-1 overflow-y-auto px-5 pb-6">
      <div v-if="filtered.length === 0" class="text-center text-slate-400 py-16">
        <div class="text-5xl mb-3">📊</div>
        <p>{{ t('history.empty') }}</p>
        <p class="text-sm mt-1">{{ t('history.emptyHint') }}</p>
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="r in filtered"
          :key="r.id"
          class="card p-4 flex items-center gap-3"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ r.gridSize }}×{{ r.gridSize }}</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ MODE_LABELS[r.mode] }}</span>
              <span :class="['text-xs font-medium', getRatingColor(r.rating)]">{{ getRatingLabel(r.rating) }}</span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ new Date(r.date).toLocaleString(dateLocale) }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-mono font-bold tabular-nums">{{ formatTimeShort(r.durationMs) }}</div>
            <div v-if="r.mistakes > 0" class="text-xs text-rose-500">{{ t('history.mistakes', { n: r.mistakes }) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
</style>

