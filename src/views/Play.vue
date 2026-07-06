<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'
import { useHistoryStore } from '@/stores/history'
import { GRID_SIZES, type GameMode, type GridSize } from '@/types'
import { formatTime, getRatingColor, getRatingLabel, ratePerformance } from '@/utils/rating'
import { MODE_LABELS } from '@/utils/mode'
import { getColorById } from '@/utils/colorPalette'
import { t } from '@/i18n'

const route = useRoute()
const router = useRouter()
const game = useGameStore()
const settings = useSettingsStore()
const history = useHistoryStore()

const size = computed<GridSize>(() => {
  const n = Number(route.params.size)
  return (GRID_SIZES as readonly number[]).includes(n) ? (n as GridSize) : 5
})
const mode = computed<GameMode>(() => {
  const m = route.query.mode as GameMode | undefined
  return m ?? 'asc'
})

// 弹窗
const showResult = ref(false)
const resultDuration = ref(0)
const resultRating = ref<'excellent' | 'good' | 'fair' | 'poor'>('fair')
const resultMistakes = ref(0)
const resultCompleted = ref(true)
const resultIsBest = ref(false)

watch([size, mode], ([s, m]) => {
  game.newGame(s, m)
}, { immediate: true })

onMounted(() => {
  game.newGame(size.value, mode.value)
  // 自动开始(用户期望直接进入训练)
  setTimeout(() => game.startGame(), 150)
  document.addEventListener('keydown', handleKey)
  document.addEventListener('visibilitychange', onVisChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKey)
  document.removeEventListener('visibilitychange', onVisChange)
})

function onVisChange() {
  if (document.hidden && game.status === 'running') game.togglePause()
}

function handleKey(e: KeyboardEvent) {
  if (showResult.value) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); replay() }
    if (e.key === 'Escape') back()
    return
  }
  if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
    e.preventDefault()
    game.togglePause()
  } else if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
    e.preventDefault()
    replay()
  } else if (e.key === 'Escape') {
    back()
  } else if (/^[0-9]$/.test(e.key)) {
    // 数字键快速点击
    const num = Number(e.key)
    const cell = game.grid.find((c) => c.value === num && !c.completed)
    if (cell) game.handleCellClick(cell.row, cell.col)
  } else if (e.key === 'a' || e.key === 'A') {
    // 字母模式(暂未启用)
  }
}

function back() {
  router.push('/')
}

function replay() {
  showResult.value = false
  game.newGame(size.value, mode.value)
  setTimeout(() => game.startGame(), 100)
}

function showResultDialog() {
  resultDuration.value = game.durationMs
  resultRating.value = ratePerformance(game.durationMs, size.value, settings.ageGroup)
  resultMistakes.value = game.mistakes
  resultCompleted.value = game.status === 'finished' && game.targetIndex >= game.targetSequence.length
  // 是否为最佳
  const previousBest = history.best(size.value, mode.value)
  resultIsBest.value = !previousBest || game.durationMs < previousBest.durationMs
  // 持久化
  const session = history.buildSessionFromGame(
    size.value, mode.value,
    Date.now() - game.durationMs, game.durationMs, game.mistakes,
    resultCompleted.value,
    game.grid.map((c) => ({ value: c.value, color: c.color })),
    settings.ageGroup, settings.strictMode
  )
  history.saveSession(session).catch(() => { /* ignore */ })
  showResult.value = true
}

watch(() => game.status, (s) => {
  if (s === 'finished') showResultDialog()
})

const center = computed(() => {
  if (game.grid.length === 0) return null
  return game.grid[Math.floor(game.grid.length / 2)]
})
const showCenter = computed(() => settings.showCenterDot && center.value)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${size.value}, 1fr)`,
  gridTemplateRows: `repeat(${size.value}, 1fr)`
}))

const fontSizeClass = computed(() => {
  if (size.value <= 4) return 'text-2xl sm:text-3xl'
  if (size.value <= 5) return 'text-xl sm:text-2xl'
  if (size.value <= 6) return 'text-lg sm:text-xl'
  return 'text-base sm:text-lg'
})

// 色彩模式: 当前目标色板(取调色板中第一个颜色作为展示)
const currentTargetColor = computed(() => {
  if (mode.value !== 'color' || !game.currentTarget) return null
  const id = game.currentTarget.value as string
  return getColorById(id)
})

// 单元格的视觉特效 class(fxCell 与 game.lastFxCell 对应则加对应 class)
function cellFxClass(cell: { row: number; col: number }): string {
  const fx = game.lastFxCell
  if (!fx) return ''
  if (fx.row !== cell.row || fx.col !== cell.col) return ''
  if (fx.effect === 'shake') return 'animate-shake'
  if (fx.effect === 'pop')   return 'fx-pop animate-cell-pop'
  if (fx.effect === 'burst') return 'fx-burst animate-cell-burst'
  return ''
}

// 单元格 cell 基础样式(不含 completed/wrong 状态)
function cellBaseClass(cell: { value: number | string; color?: string; bg?: string }) {
  if (mode.value === 'color' && cell.color) {
    // 色彩模式:用 cell.value (hex) 作为背景,字色自动取深色
    return 'border-transparent text-white/95'
  }
  if (cell.bg) {
    // 数字模式 multi:用 cell.bg 作背景,数字用白色
    return 'border-transparent text-white'
  }
  return 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
}

function cellCompletedClass() {
  if (!settings.highlightOnClick) {
    // 关闭高亮:已点击格子变透明但仍占位
    return 'opacity-20 scale-95'
  }
  return 'bg-primary-50 dark:bg-primary-900/30 text-primary-300 dark:text-primary-700 scale-95'
}

function cellStyle(cell: { value: number | string; color?: string; bg?: string }) {
  if (mode.value === 'color' && cell.color) {
    return { backgroundColor: String(cell.value) }
  }
  if (cell.bg) {
    return { backgroundColor: cell.bg }
  }
  return {}
}

// 形状 class:solid/circle/square/rounded
const shapeMap: Record<string, string> = {
  square: 'rounded-lg sm:rounded-xl',
  rounded: 'rounded-2xl sm:rounded-3xl',
  circle: 'rounded-full'
}
function cellShapeClass(cell: { shape?: string }) {
  if (cell.shape && cell.shape !== 'irregular') {
    return shapeMap[cell.shape] || shapeMap.square
  }
  // 全局设置
  return shapeMap[settings.cellShape] || shapeMap.square
}

// 色彩模式 cell 显示的色名首字符(中文 1 字符,英文取大写首字母)
function cellColorLetter(colorId: string | undefined): string {
  if (!colorId) return ''
  const c = getColorById(colorId)
  if (!c) return ''
  // 中文取 [0];英文取 [0].toUpperCase()
  return c.name.charAt(0)
}
</script>

<template>
  <div class="flex-1 flex flex-col safe-top safe-bottom">
    <!-- 顶部信息条 -->
    <header class="px-4 pt-4 pb-2 flex items-center justify-between gap-3">
      <button class="btn-ghost !p-2" @click="back" :aria-label="t('play.back')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="flex-1 text-center">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          {{ size }}×{{ size }} · {{ MODE_LABELS[mode] }}
        </div>
        <div class="text-2xl sm:text-3xl font-mono font-bold tabular-nums">
          {{ formatTime(game.elapsedMs) }}
        </div>
      </div>
      <button class="btn-ghost !p-2" @click="game.togglePause" :aria-label="t('play.paused')">
        <svg v-if="game.status === 'running'" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </header>

    <!-- 提示信息条 -->
    <div class="px-4 pb-3 flex items-center justify-center gap-4 text-sm">
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500 dark:text-slate-400">{{ t('play.nextTarget') }}</span>
        <span v-if="mode === 'color' && currentTargetColor" class="inline-flex items-center gap-1.5 font-bold">
          <span class="inline-block w-5 h-5 rounded shadow ring-1 ring-black/10" :style="{ backgroundColor: currentTargetColor.value }" />
          <span class="text-slate-700 dark:text-slate-200">{{ t('play.colorLabel', { name: currentTargetColor.name }) }}</span>
        </span>
        <span v-else-if="game.currentTarget" class="font-bold text-primary-500">
          <span :class="game.currentTarget.color === 'black' ? 'text-slate-900 dark:text-white' : ''">
            {{ game.currentTarget.value }}
          </span>
        </span>
        <span v-else class="text-slate-400">—</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500 dark:text-slate-400">{{ t('play.errors') }}</span>
        <span :class="['font-bold', game.mistakes > 0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200']">
          {{ game.mistakes }}
        </span>
      </div>
    </div>

    <!-- 网格 -->
    <main class="flex-1 flex items-center justify-center px-4 pb-2 min-h-0">
      <div class="relative w-full max-w-[min(92vw,92vh,560px)] aspect-square">
        <div :class="['w-full h-full grid gap-1.5 sm:gap-2 select-none', game.status === 'paused' ? 'opacity-40' : '']" :style="gridStyle">
          <button
            v-for="cell in game.grid"
            :key="`${cell.row}-${cell.col}`"
            @click="game.handleCellClick(cell.row, cell.col)"
            :class="[
              'relative font-bold flex items-center justify-center transition-all',
              cellShapeClass(cell),
              fontSizeClass,
              cellFxClass(cell),
              cell.completed ? cellCompletedClass() : cellBaseClass(cell),
              game.wrongCell && game.wrongCell.row === cell.row && game.wrongCell.col === cell.col
                ? '!bg-rose-500 !text-white animate-shake'
                : ''
            ]"
            :style="cellStyle(cell)"
            :disabled="game.status === 'finished'"
            :aria-label="t('play.cellAria', { value: cell.value })"
          >
            <span v-if="mode === 'color'" class="text-xs sm:text-sm font-semibold uppercase tracking-wide">
              {{ cellColorLetter(cell.color) }}
            </span>
            <template v-else>
              <span v-if="cell.color === 'red'" class="text-red-500">{{ cell.value }}</span>
              <span v-else-if="cell.color === 'black'" class="text-slate-900 dark:text-white">{{ cell.value }}</span>
              <span v-else>{{ cell.value }}</span>
            </template>
          </button>
        </div>
        <!-- 中心红点 -->
        <div v-if="showCenter" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 shadow ring-2 ring-white dark:ring-slate-900 pointer-events-none" />
        <!-- 暂停遮罩 -->
        <div v-if="game.status === 'paused'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="text-2xl font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 px-6 py-3 rounded-2xl shadow">
            {{ t('play.paused') }}
          </div>
        </div>
      </div>
    </main>

    <!-- 底部按钮 -->
    <footer class="px-4 pb-4 pt-2 flex gap-2">
      <button class="btn-ghost flex-1" @click="replay">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 3v5h5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t('play.replay') }}
      </button>
      <button class="btn-ghost flex-1" @click="back">{{ t('play.quit') }}</button>
    </footer>

    <!-- 结果弹窗 -->
    <transition name="fade">
      <div v-if="showResult" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="back">
        <div class="card w-full max-w-sm p-6 animate-fade-in">
          <h3 class="text-lg font-bold mb-1">
            {{ resultCompleted ? (resultIsBest ? t('play.newRecord') : t('play.finished')) : t('play.interrupted') }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {{ size }}×{{ size }} · {{ MODE_LABELS[mode] }}
          </p>
          <div class="text-center my-6">
            <div class="text-5xl font-mono font-bold tabular-nums tracking-tight">
              {{ formatTime(resultDuration) }}
            </div>
            <div :class="['mt-2 text-sm font-medium', getRatingColor(resultRating)]">
              {{ getRatingLabel(resultRating) }} · {{ t('play.errorsCount', { n: resultMistakes }) }}
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn-ghost flex-1" @click="back">{{ t('play.back') }}</button>
            <button class="btn-primary flex-1" @click="replay">{{ t('play.again') }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

