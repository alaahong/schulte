/**
 * Fisher-Yates 洗牌算法
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 生成 n×n 网格,数字 1~n² 随机排列
 */
export function generateNumberGrid(n: number): number[][] {
  const total = n * n
  const nums = shuffle(Array.from({ length: total }, (_, i) => i + 1))
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(nums.slice(i * n, (i + 1) * n))
  }
  return grid
}

/**
 * 生成 n×n 红黑双驱网格(Gorbov 表)
 * 数字 1~n² 随机,每格随机分配红/黑
 */
export function generateGorbovGrid(n: number): Array<{ value: number; color: 'red' | 'black' }> {
  const total = n * n
  const nums = shuffle(Array.from({ length: total }, (_, i) => i + 1))
  return nums.map((value) => ({
    value,
    color: Math.random() < 0.5 ? 'red' : 'black'
  }))
}

/**
 * 生成色彩模式网格(随机色块,无数字)
 * @param n 网格边长
 * @param paletteValue 用户挑选的颜色值列表(若空则使用默认 6 色)
 */
export function generateColorGrid(n: number, paletteValue: string[] = []): string[] {
  const total = n * n
  const palette = paletteValue.length > 0
    ? paletteValue
    : ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
  // 颜色种数: 至少 2 种(单色无意义),不超过实际需要(每色至少 1 格)
  const colorCount = Math.min(palette.length, Math.max(2, Math.min(total, 6)))
  const colors = shuffle(palette).slice(0, colorCount)
  const result: string[] = []
  // 让每种颜色大致均匀出现
  for (let i = 0; i < total; i++) {
    result.push(colors[i % colors.length])
  }
  return shuffle(result)
}
