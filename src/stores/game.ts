/**
 * 游戏 Store:当前训练会话、计时、点击逻辑
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Cell, CellShape, GameMode, GridSize } from '@/types'
import { generateGorbovGrid, generateNumberGrid } from '@/utils/shuffle'
import { buildTargetSequence } from '@/utils/mode'
import { getColorById } from '@/utils/colorPalette'
import { useSettingsStore } from './settings'

export type GameStatus = 'idle' | 'ready' | 'running' | 'paused' | 'finished'

export const useGameStore = defineStore('game', () => {
  const settings = useSettingsStore()

  // 配置
  const gridSize = ref<GridSize>(5)
  const mode = ref<GameMode>('asc')

  // 状态
  const status = ref<GameStatus>('idle')
  const grid = ref<Cell[]>([])
  const targetIndex = ref(0)             // 当前应点击的目标序号
  const targetSequence = ref<Array<{ value: number | string; color?: string }>>([])
  const currentTarget = computed(() => targetSequence.value[targetIndex.value] ?? null)

  // 计时
  const startedAt = ref<number>(0)       // 首次点击时记录
  const pausedAt = ref<number>(0)        // 暂停时记录
  const pausedAccumMs = ref(0)           // 累计暂停时长
  const elapsedMs = ref(0)               // 当前显示耗时
  const finishedAt = ref<number | null>(null)
  const durationMs = ref<number>(0)      // 最终耗时

  // 错误
  const mistakes = ref(0)
  const wrongCell = ref<{ row: number; col: number } | null>(null)

  let rafId: number | null = null
  let wrongTimeout: number | null = null

  // ─── 计时器 ─────────────────────────────────────────
  function tick() {
    if (status.value !== 'running') return
    const now = performance.now()
    elapsedMs.value = now - startedAt.value - pausedAccumMs.value
    rafId = requestAnimationFrame(tick)
  }

  function startTimer() {
    if (status.value === 'running') return
    if (status.value === 'paused' && pausedAt.value > 0) {
      pausedAccumMs.value += performance.now() - pausedAt.value
      pausedAt.value = 0
    } else {
      startedAt.value = performance.now()
      pausedAccumMs.value = 0
    }
    status.value = 'running'
    rafId = requestAnimationFrame(tick)
  }

  function pauseTimer() {
    if (status.value !== 'running') return
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = null
    pausedAt.value = performance.now()
    status.value = 'paused'
  }

  function stopTimer(): number {
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = null
    const now = performance.now()
    finishedAt.value = now
    // 若最后一次状态是 running,补回累计
    if (status.value === 'paused' && pausedAt.value > 0) {
      pausedAccumMs.value += now - pausedAt.value
      pausedAt.value = 0
    }
    durationMs.value = Math.max(0, now - startedAt.value - pausedAccumMs.value)
    status.value = 'finished'
    return durationMs.value
  }

  // ─── 网格生成 ───────────────────────────────────────
  function buildCells(size: GridSize, m: GameMode): Cell[] {
    if (m === 'gorbov') {
      const items = generateGorbovGrid(size)
      return items.map((it, idx) => ({
        row: Math.floor(idx / size),
        col: idx % size,
        value: it.value,
        color: it.color
      }))
    }
    if (m === 'color') {
      // 颜色模式: 从用户选定的调色板中随机取色生成网格
      // 每格 value 存 hex(用于显示),color 存 palette id(用于匹配目标)
      const selectedIds = settings.colorPalette
      const paletteValues = selectedIds
        .map((id) => getColorById(id)?.value)
        .filter((v): v is string => !!v)
      // shuffle 后取若干种(最多 6 种,最少 2 种,不超过网格大小)
      const usableCount = Math.min(paletteValues.length, Math.max(2, Math.min(size * size, 6)))
      const colors = [...paletteValues].sort(() => Math.random() - 0.5).slice(0, usableCount)
      const total = size * size
      const arr: string[] = []
      for (let i = 0; i < total; i++) arr.push(colors[i % colors.length])
      // 洗牌
      const shuffled = arr.sort(() => Math.random() - 0.5)
      // 找到每个 hex 对应的 id
      const hexToId = new Map<string, string>()
      for (const id of selectedIds) {
        const v = getColorById(id)?.value
        if (v && !hexToId.has(v)) hexToId.set(v, id)
      }
      return shuffled.map((hex, idx) => ({
        row: Math.floor(idx / size),
        col: idx % size,
        value: hex,
        color: hexToId.get(hex)
      }))
    }
    const nums = generateNumberGrid(size)
    // 多彩色块:从用户调色板随机取色作背景,提高数字模式难度
    const paletteValues = settings.cellStyle === 'multi'
      ? settings.colorPalette
          .map((id) => getColorById(id)?.value)
          .filter((v): v is string => !!v)
      : []
    // irregular 模式:4 种 shape 随机分配
    const allShapes: CellShape[] = ['square', 'rounded', 'circle', 'irregular']
    const useIrregular = settings.cellShape === 'irregular'
    const cells: Cell[] = []
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell: Cell = {
          row: r, col: c, value: nums[r][c]
        }
        if (paletteValues.length > 0) {
          // 均匀分布,避免相邻同色
          const idx = (r * size + c) % paletteValues.length
          cell.bg = paletteValues[(idx + Math.floor(Math.random() * paletteValues.length)) % paletteValues.length]
        }
        if (useIrregular) {
          cell.shape = allShapes[Math.floor(Math.random() * allShapes.length)]
        }
        cells.push(cell)
      }
    }
    return cells
  }

  // ─── 会话管理 ───────────────────────────────────────
  function newGame(size?: GridSize, m?: GameMode) {
    if (size) gridSize.value = size
    if (m) mode.value = m
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = null
    if (wrongTimeout) {
      clearTimeout(wrongTimeout)
      wrongTimeout = null
    }

    grid.value = buildCells(gridSize.value, mode.value)
    const palette = mode.value === 'color' ? settings.colorPalette : []
    targetSequence.value = buildTargetSequence(mode.value, gridSize.value ** 2, grid.value, palette)
    targetIndex.value = 0
    mistakes.value = 0
    startedAt.value = 0
    pausedAt.value = 0
    pausedAccumMs.value = 0
    elapsedMs.value = 0
    finishedAt.value = null
    durationMs.value = 0
    wrongCell.value = null
    status.value = 'ready'
  }

  function startGame() {
    if (status.value === 'finished') newGame()
    if (status.value === 'idle') newGame()
    startTimer()
  }

  function togglePause() {
    if (status.value === 'running') pauseTimer()
    else if (status.value === 'paused') startTimer()
  }

  // ─── 点击处理 ───────────────────────────────────────
  function handleCellClick(row: number, col: number) {
    if (status.value === 'finished') return

    const cell = grid.value.find((c) => c.row === row && c.col === col)
    if (!cell) return
    if (cell.completed) return

    const target = currentTarget.value
    if (!target) return

    const isCorrect = isMatch(cell, target)

    if (!isCorrect) {
      mistakes.value++
      wrongCell.value = { row, col }
      // 触感反馈
      tryVibrate(40)
      if (settings.soundEnabled) playWrong()
      if (wrongTimeout) clearTimeout(wrongTimeout)
      wrongTimeout = window.setTimeout(() => {
        wrongCell.value = null
      }, 350)
      if (settings.strictMode) {
        // 严苛模式:点错立即结束
        stopTimer()
        tryVibrate([60, 40, 60])
        if (settings.soundEnabled) playFail()
        return
      }
      return
    }

    // 正确
    cell.completed = true
    targetIndex.value++
    if (settings.soundEnabled) playClick()
    tryVibrate(10)

    // 第一次正确点击时启动计时
    if (status.value === 'ready') startTimer()

    if (targetIndex.value >= targetSequence.value.length) {
      stopTimer()
      if (settings.soundEnabled) playSuccess()
      tryVibrate([20, 30, 60])
    }
  }

  function isMatch(cell: Cell, target: { value: number | string; color?: string }) {
    if (mode.value === 'gorbov') {
      return cell.value === target.value && cell.color === target.color
    }
    if (mode.value === 'color') {
      return cell.color === target.value
    }
    return cell.value === target.value
  }

  // ─── 反馈(轻量 Web Audio + 触感) ────────────────
  let audioCtx: AudioContext | null = null
  function getCtx(): AudioContext | null {
    if (audioCtx) return audioCtx
    try {
      const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!Ctor) return null
      audioCtx = new Ctor()
      return audioCtx
    } catch { return null }
  }
  function beep(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.08) {
    if (!settings.soundEnabled) return
    const ctx = getCtx(); if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = vol
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.stop(ctx.currentTime + duration)
  }
  function playClick()  { beep(660, 0.06, 'triangle', 0.06) }
  function playWrong()  { beep(220, 0.18, 'sawtooth', 0.08) }
  function playSuccess() {
    beep(523, 0.1, 'triangle', 0.08)
    setTimeout(() => beep(784, 0.16, 'triangle', 0.08), 110)
  }
  function playFail()   { beep(180, 0.4, 'sawtooth', 0.1) }

  function tryVibrate(pattern: number | number[]) {
    if (!settings.hapticEnabled) return
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern) } catch { /* ignore */ }
    }
  }

  return {
    // 状态
    gridSize, mode, status, grid, targetIndex, targetSequence, currentTarget,
    startedAt, pausedAt, pausedAccumMs, elapsedMs, finishedAt, durationMs,
    mistakes, wrongCell,
    // 方法
    newGame, startGame, togglePause, handleCellClick, stopTimer,
    beep
  }
})
