// 重新截图:用 Playwright 生成覆盖关键步骤的高质量截图
// 关键点:每张截图都展示一项有代表性的"特征"状态
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, 'screenshots')
const BASE = 'http://127.0.0.1:8765'

// iPhone 14 Pro 视口,做"真实手机感"的截图
const VIEWPORT = { width: 390, height: 844 }
const SCALE = 2

// 默认 settings(完整覆盖,避免用户偏好影响)
const DEFAULTS = {
  theme: 'auto',
  ageGroup: '18+',
  strictMode: false,
  soundEnabled: false,
  showCenterDot: false,
  hapticEnabled: false,
  keepAwake: false,
  colorPalette: ['red', 'amber', 'emerald', 'blue', 'violet', 'pink'],
  highlightOnClick: true,
  cellStyle: 'solid',
  cellShape: 'square'
}

const makeSettings = (override) => ({ ...DEFAULTS, ...override })

// 截图场景配置:
//   file         -> 输出文件名
//   settings     -> 注入到 localStorage 的 settings(为 null 则清空)
//   url          -> 路由
//   desc         -> 描述(日志用)
//   clicks       -> 可选,预点击的格值序列(让截图显示"进行中"的状态)
//   waitTime     -> 可选,加载后额外等待的毫秒(默认 600)
const SCENARIOS = [
  // === 1. 首页 ===
  {
    file: '01-home.png',
    settings: null,
    url: '/',
    desc: '首页:训练模式入口'
  },

  // === 2. 经典升序 3×3 入门(纯色/方块)===
  {
    file: '02-play-3x3.png',
    settings: makeSettings({ cellStyle: 'solid', cellShape: 'square' }),
    url: '/play/3?mode=asc',
    desc: '3×3 入门(纯色/方块)',
    clicks: [1, 2, 3]
  },

  // === 3. 经典升序 5×5 标准(纯色/方块)===
  {
    file: '03-play-5x5-standard.png',
    settings: makeSettings({ cellStyle: 'solid', cellShape: 'square' }),
    url: '/play/5?mode=asc',
    desc: '5×5 标准(纯色/方块)',
    clicks: [1, 2, 3, 4, 5, 6, 7]
  },

  // === 4. 经典升序 5×5 多彩色块(方块)===
  {
    file: '04-play-5x5-multi-color.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'square' }),
    url: '/play/5?mode=asc',
    desc: '5×5 多彩色块',
    clicks: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },

  // === 5. 经典升序 5×5 正圆(多彩)===
  {
    file: '05-play-5x5-circle.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'circle' }),
    url: '/play/5?mode=asc',
    desc: '5×5 正圆(多彩)',
    clicks: [1, 2, 3, 4, 5, 6, 7]
  },

  // === 6. 经典升序 5×5 异形(多彩)===
  {
    file: '06-play-5x5-irregular.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'irregular' }),
    url: '/play/5?mode=asc',
    desc: '5×5 异形(多彩)',
    clicks: [1, 2, 3, 4, 5, 6, 7, 8]
  },

  // === 7. 8×8 高阶 ===
  {
    file: '07-play-8x8.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'rounded' }),
    url: '/play/8?mode=asc',
    desc: '8×8 高阶',
    clicks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },

  // === 8. 反向降序 5×5 ===
  {
    file: '08-play-desc.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'square' }),
    url: '/play/5?mode=desc',
    desc: '反向降序 5×5',
    clicks: [25, 24, 23, 22, 21, 20, 19]
  },

  // === 9. 交替模式 5×5 ===
  {
    file: '09-play-alternating.png',
    settings: makeSettings({ cellStyle: 'solid', cellShape: 'square' }),
    url: '/play/5?mode=alternating',
    desc: '交替模式 5×5',
    clicks: [1, 25, 2, 24, 3, 23, 4]
  },

  // === 10. 红黑双驱 5×5 ===
  {
    file: '10-play-gorbov.png',
    settings: makeSettings({ cellStyle: 'solid', cellShape: 'square' }),
    url: '/play/5?mode=gorbov',
    desc: '红黑双驱 5×5',
    clicks: [1, 25, 2, 24, 3, 23, 4, 22]
  },

  // === 11. 色彩模式 4×4 (4 色)===
  {
    file: '11-play-color-4x4.png',
    settings: makeSettings({ cellStyle: 'solid', cellShape: 'square',
      colorPalette: ['red', 'amber', 'emerald', 'blue'] }),
    url: '/play/4?mode=color',
    desc: '色彩模式 4×4 (4 色)',
    clicks: [1, 2, 3]
  },

  // === 12. 色彩模式 5×5 (6 色,默认调色板)===
  {
    file: '12-play-color-5x5.png',
    settings: makeSettings({ cellStyle: 'solid', cellShape: 'square' }),
    url: '/play/5?mode=color',
    desc: '色彩模式 5×5 (6 色,默认)',
    clicks: [1, 2, 3, 4]
  },

  // === 13. 设置页 ===
  {
    file: '13-settings.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'irregular',
      colorPalette: ['red', 'amber', 'emerald', 'blue', 'violet', 'pink'] }),
    url: '/settings',
    desc: '设置页(多彩+异形+6色)'
  },

  // === 14. 历史记录页 ===
  {
    file: '14-history.png',
    settings: makeSettings({ cellStyle: 'multi', cellShape: 'square' }),
    url: '/history',
    desc: '历史记录页'
  },

  // === 15. 关于页 ===
  {
    file: '15-about.png',
    settings: null,
    url: '/about',
    desc: '关于页(参考成绩表)'
  }
]

async function shootScenario(browser, sc) {
  console.log(`[shot] ${sc.file}  ${sc.desc}`)

  // 每个场景独立 context,避免 addInitScript 累积
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  })

  // 用 init script 在任何页面加载前注入 localStorage
  if (sc.settings) {
    await context.addInitScript((s) => {
      try { localStorage.setItem('schulte.settings.v1', JSON.stringify(s)) } catch (e) {}
    }, sc.settings)
  } else {
    await context.addInitScript(() => {
      try { localStorage.removeItem('schulte.settings.v1') } catch (e) {}
    })
  }

  const page = await context.newPage()
  try {
    await page.goto(BASE + sc.url, { waitUntil: 'domcontentloaded' })

    // 等 Vue 路由 + Pinia + 组件挂载完成
    try {
      // 优先等网格按钮出现(play 页)
      await page.waitForSelector('button[aria-label^="格"]', { timeout: 8000 })
    } catch {
      // 其他页:等主标题/任意按钮出现
      try { await page.waitForSelector('h1, h2, .card, button', { timeout: 4000 }) } catch {}
    }

    // 额外等待让动画/重绘稳定 + 计时器/进度可见
    await page.waitForTimeout(sc.waitTime ?? 700)

    // 预点击
    const clicks = sc.clicks
    if (clicks) {
      for (const n of clicks) {
        const btn = page.locator(`button[aria-label="格 ${n}"]`)
        if (await btn.count() > 0) {
          await btn.first().click({ force: true })
          await page.waitForTimeout(50)
        }
      }
      // 等待预点击的视觉变化稳定
      await page.waitForTimeout(500)
    }

    const outPath = join(OUT_DIR, sc.file)
    await page.screenshot({ path: outPath, fullPage: false })
    console.log(`       → ${outPath}`)
  } catch (e) {
    console.error(`       FAILED: ${e.message}`)
  } finally {
    await page.close()
    await context.close()
  }
}

;(async () => {
  if (!existsSync(OUT_DIR)) throw new Error('screenshots dir missing')

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    for (const sc of SCENARIOS) {
      await shootScenario(browser, sc)
    }
  } finally {
    await browser.close()
  }
  console.log(`Done. ${SCENARIOS.length} screenshots saved to ${OUT_DIR}`)
})().catch(e => { console.error(e); process.exit(1) })
