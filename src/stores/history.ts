/**
 * 历史记录 Store:读写 IndexedDB、查询最佳/平均/趋势
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/utils/db'
import type { GameMode, GridSize, Record, Session } from '@/types'
import { ratePerformance } from '@/utils/rating'

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useHistoryStore = defineStore('history', () => {
  const records = ref<Record[]>([])
  const loading = ref(false)

  async function loadAll() {
    loading.value = true
    try {
      const all = await db.records.orderBy('date').reverse().toArray()
      records.value = all
    } finally {
      loading.value = false
    }
  }

  async function saveSession(session: Session) {
    const record: Record = {
      id: newId(),
      sessionId: session.id,
      gridSize: session.gridSize,
      mode: session.mode,
      durationMs: session.durationMs,
      mistakes: session.mistakes,
      date: session.startedAt,
      rating: session.rating,
      ageGroup: session.ageGroup
    }
    await db.records.add(record)
    await db.sessions.add(session)
    records.value = [record, ...records.value]
  }

  async function clear() {
    await db.records.clear()
    await db.sessions.clear()
    records.value = []
  }

  // 按 (size, mode) 过滤
  function query(size?: GridSize, mode?: GameMode): Record[] {
    return records.value.filter((r) => {
      if (size !== undefined && r.gridSize !== size) return false
      if (mode !== undefined && r.mode !== mode) return false
      return true
    })
  }

  function best(size?: GridSize, mode?: GameMode): Record | null {
    const list = query(size, mode).filter((r) => r.rating !== 'poor')
    if (list.length === 0) return null
    return list.reduce((a, b) => (a.durationMs <= b.durationMs ? a : b))
  }

  function average(size?: GridSize, mode?: GameMode): number | null {
    const list = query(size, mode)
    if (list.length === 0) return null
    return list.reduce((s, r) => s + r.durationMs, 0) / list.length
  }

  function recent(size?: GridSize, mode?: GameMode, n = 10): Record[] {
    return query(size, mode).slice(0, n)
  }

  function buildSessionFromGame(
    gridSize: GridSize,
    mode: GameMode,
    startedAt: number,
    durationMs: number,
    mistakes: number,
    completed: boolean,
    gridData: Array<{ value: number | string; color?: string }>,
    ageGroup: '7-12' | '12-17' | '18+',
    strictMode: boolean
  ): Session {
    return {
      id: newId(),
      gridSize, mode,
      symbolKind: 'number',
      startedAt,
      finishedAt: Date.now(),
      durationMs,
      mistakes,
      strictMode,
      completed,
      grid: gridData,
      ageGroup,
      rating: ratePerformance(durationMs, gridSize, ageGroup)
    }
  }

  return {
    records, loading,
    loadAll, saveSession, clear,
    query, best, average, recent,
    buildSessionFromGame
  }
})
