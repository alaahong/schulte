// 截图配置:每行 = [文件名, settings json, 路由, 视口]
// settings 为 null 表示用 localStorage 默认值(空)
export const SCENARIOS = [
  // === 首页 / 已有 ===
  {
    file: '01-home.png',
    settings: null, // 用默认,展示典型首页
    route: '/',
    viewport: { w: 390, h: 844 }, // iPhone 14 Pro 尺寸
    desc: '首页'
  },

  // === 数字模式:不同 grid size / style / shape 组合 ===
  {
    file: '02-play-3x3-solid.png',
    settings: { cellStyle: 'solid', cellShape: 'square' },
    route: '/play/3?mode=asc',
    viewport: { w: 390, h: 844 },
    desc: '3×3 入门(纯色/方块)'
  },
  {
    file: '03-play-5x5-multi-irr.png',
    settings: { cellStyle: 'multi', cellShape: 'irregular' },
    route: '/play/5?mode=asc',
    viewport: { w: 390, h: 844 },
    desc: '5×5 经典升序(多彩/异形)'
  },
  {
    file: '04-play-8x8-multi-rnd.png',
    settings: { cellStyle: 'multi', cellShape: 'rounded' },
    route: '/play/8?mode=asc',
    viewport: { w: 390, h: 844 },
    desc: '8×8 高阶(多彩/圆润)'
  },
  {
    file: '05-play-5x5-circle.png',
    settings: { cellStyle: 'multi', cellShape: 'circle' },
    route: '/play/5?mode=asc',
    viewport: { w: 390, h: 844 },
    desc: '5×5(正圆)'
  },

  // === 5 种训练模式 ===
  {
    file: '06-play-desc-5x5.png',
    settings: { cellStyle: 'multi', cellShape: 'square' },
    route: '/play/5?mode=desc',
    viewport: { w: 390, h: 844 },
    desc: '反向降序 5×5'
  },
  {
    file: '07-play-alternating-5x5.png',
    settings: { cellStyle: 'solid', cellShape: 'square' },
    route: '/play/5?mode=alternating',
    viewport: { w: 390, h: 844 },
    desc: '交替模式 5×5'
  },
  {
    file: '08-play-gorbov-5x5.png',
    settings: { cellStyle: 'solid', cellShape: 'square' },
    route: '/play/5?mode=gorbov',
    viewport: { w: 390, h: 844 },
    desc: '红黑双驱 5×5'
  },
  {
    file: '09-play-color-4x4.png',
    settings: { cellStyle: 'solid', cellShape: 'square', colorPalette: ['red', 'amber', 'emerald', 'blue'] },
    route: '/play/4?mode=color',
    viewport: { w: 390, h: 844 },
    desc: '色彩模式 4×4(4 色)'
  },
  {
    file: '10-play-color-3x3-2color.png',
    settings: { cellStyle: 'solid', cellShape: 'square', colorPalette: ['red', 'blue'] },
    route: '/play/3?mode=color',
    viewport: { w: 390, h: 844 },
    desc: '色彩模式 3×3(2 色,最少配置)'
  },

  // === 设置/历史/关于 ===
  {
    file: '11-settings.png',
    settings: { cellStyle: 'multi', cellShape: 'irregular', colorPalette: ['red', 'amber', 'emerald', 'blue', 'violet', 'pink'] },
    route: '/settings',
    viewport: { w: 390, h: 844 },
    desc: '设置页(多彩+异形+6色)'
  },
  {
    file: '12-about.png',
    settings: null,
    route: '/about',
    viewport: { w: 390, h: 844 },
    desc: '关于页(参考成绩表)'
  }
]
