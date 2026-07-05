/**
 * IndexedDB 封装(Dexie)
 */
import Dexie, { type Table } from 'dexie'
import type { Record, Session } from '@/types'

export class SchulteDB extends Dexie {
  records!: Table<Record, string>
  sessions!: Table<Session, string>

  constructor() {
    super('schulte-grid-db')
    this.version(1).stores({
      // primary key 放最前,后续为索引
      records: 'id, sessionId, gridSize, mode, date, rating',
      sessions: 'id, gridSize, mode, startedAt, completed'
    })
  }
}

export const db = new SchulteDB()
