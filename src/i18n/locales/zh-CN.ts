/**
 * 简体中文翻译表
 * Key 约定: <模块>.<短键>   模块:common / app / home / play / history / settings / about / modes / rating / palette / shapes / styles / ages
 */
export const zhCN: Record<string, string> = {
  // ===== common =====
  'common.confirm.clearHistory': '确定清空所有历史记录?此操作不可恢复。',
  'common.back': '返回',
  'common.confirm': '确定',
  'common.cancel': '取消',
  'common.language': '语言',
  'common.all': '全部',
  'common.allModes': '全部模式',

  // ===== app =====
  'app.title': '舒尔特方格',
  'app.tagline': '专注力训练 · 每日 5-10 分钟',

  // ===== home =====
  'home.modes': '训练模式',
  'home.gridSize': '网格大小',
  'home.start': '开始训练',
  'home.about': '训练方法说明',
  'home.best': '最佳 {time}',
  'home.noRecord': '暂无记录',
  'home.history': '历史记录',
  'home.settings': '设置',

  // ===== play =====
  'play.nextTarget': '下一目标',
  'play.errors': '错误',
  'play.paused': '已暂停',
  'play.replay': '重开',
  'play.quit': '退出',
  'play.back': '返回',
  'play.again': '再来一次',
  'play.newRecord': '新纪录!',
  'play.finished': '训练完成',
  'play.interrupted': '训练中断',
  'play.errorsCount': '错误 {n} 次',
  'play.cellAria': '格 {value}',
  'play.colorLabel': '{name}色',

  // ===== history =====
  'history.title': '历史记录',
  'history.empty': '还没有训练记录',
  'history.emptyHint': '完成一次训练后,这里会显示成绩趋势',
  'history.clear': '清空',
  'history.mistakes': '{n} 错',

  // ===== settings =====
  'settings.title': '设置',
  'settings.theme': '主题',
  'settings.themeLight': '浅色',
  'settings.themeDark': '深色',
  'settings.themeAuto': '跟随系统',
  'settings.ageGroup': '年龄段(用于评级)',
  'settings.behavior': '训练行为',
  'settings.strictMode': '严苛模式',
  'settings.strictModeDesc': '点错立即结束训练',
  'settings.highlightOnClick': '点击后高亮',
  'settings.highlightOnClickDesc': '已点击的格子变淡显示',
  'settings.sound': '音效',
  'settings.soundDesc': '点击、错误、完成时反馈音',
  'settings.haptic': '触感反馈',
  'settings.hapticDesc': '振动(支持设备)',
  'settings.centerDot': '显示中心红点',
  'settings.centerDotDesc': '用于训练中心注视',
  'settings.cellStyle': '数字模式 · 色块',
  'settings.cellShape': '单元格形状',
  'settings.palette': '色彩模式 · 调色板',
  'settings.paletteHint': '选择参与训练的颜色(至少 2 种)。按选中顺序轮转出现:红 → 蓝 → ...',
  'settings.paletteSelected': '已选 {sel} / {total} 种颜色',
  'settings.paletteReset': '恢复默认',
  'settings.data': '数据',
  'settings.clearHistory': '清空历史记录',
  'settings.aboutLink': '训练方法说明 →',
  'settings.language': '界面语言',

  // ===== about =====
  'about.title': '关于舒尔特方格',
  'about.whatTitle': '什么是舒尔特方格?',
  'about.whatBody': '舒尔特方格(Schulte Grid)由德国心理学家沃尔特·舒尔特(Walter Schulte)于 1960 年代提出,最初用于飞行员与航天员的注意力训练。它是一张 N×N 的方格表,内含 1~N² 的随机数字,训练者需要按顺序快速点击。',
  'about.trainTitle': '训练什么?',
  'about.trainStability': '注意力稳定性',
  'about.trainStabilityDesc': '在训练期间保持高度专注',
  'about.trainSpan': '注意力广度',
  'about.trainSpanDesc': '用周边视觉同时关注多个目标',
  'about.trainDistribution': '注意力分配',
  'about.trainDistributionDesc': '同时处理多个任务(尤其在交替/Gorbov 模式)',
  'about.trainSpeed': '视觉搜索速度',
  'about.trainSpeedDesc': '在杂乱信息中快速定位目标',
  'about.refTitle': '参考成绩(5×5)',
  'about.refAge': '年龄段',
  'about.refNote': '其他网格大小按 N²/25 等比缩放。',
  'about.tipTitle': '训练技巧',
  'about.tip1': '眼睛盯住方格中心,只用周边视觉搜索',
  'about.tip2': '先求准确,再求速度;切勿乱猜',
  'about.tip3': '每天 5-10 分钟即可,贵在坚持',
  'about.tip4': '从 3×3 / 4×4 起步,逐步提升到 5×5 / 6×6',
  'about.tip5': '关闭严苛模式可降低挫败感,熟练后再开启',
  'about.platformTitle': '平台支持',
  'about.platformBody': '本应用基于 Tauri 2 + Vue 3 构建,可打包为 Windows / macOS / Linux 桌面应用、iOS / Android 原生应用,以及 Web / PWA 部署。',
  'about.footer': 'v0.1.0 · Made with focus',

  // ===== modes =====
  'modes.asc': '经典升序',
  'modes.desc': '反向降序',
  'modes.alternating': '交替模式',
  'modes.gorbov': '红黑双驱',
  'modes.color': '色彩模式',
  'modes.custom': '自定义',
  'modes.ascDesc': '按 1 → N² 顺序点击',
  'modes.descDesc': '按 N² → 1 降序点击',
  'modes.alternatingDesc': '小→大→小交替,训练注意力分配',
  'modes.gorbovDesc': '红黑交替,需同时关注颜色与顺序',
  'modes.colorDesc': '按颜色轮转点击,可在设置中调整调色板',
  'modes.customDesc': '自定义符号',

  // ===== rating =====
  'rating.excellent': '优秀',
  'rating.good': '良好',
  'rating.fair': '中等',
  'rating.poor': '较弱',

  // ===== age group =====
  'age.7-12': '7-12 岁',
  'age.12-17': '12-17 岁',
  'age.18+': '18 岁以上',
  'age.kid': '儿童',
  'age.teen': '青少年',
  'age.adult': '成人',

  // ===== cell style =====
  'styles.solid': '纯色',
  'styles.solidDesc': '白底带边框(默认)',
  'styles.multi': '多彩',
  'styles.multiDesc': '数字色块随机填色,提高难度',

  // ===== cell shape =====
  'shapes.square': '方块',
  'shapes.squareDesc': '圆角方(默认)',
  'shapes.rounded': '圆润',
  'shapes.roundedDesc': '更圆润的方块',
  'shapes.circle': '正圆',
  'shapes.circleDesc': '全部圆形',
  'shapes.irregular': '异形',
  'shapes.irregularDesc': '每格随机(趣味)',

  // ===== palette =====
  'palette.red': '红',
  'palette.amber': '橙',
  'palette.emerald': '绿',
  'palette.blue': '蓝',
  'palette.violet': '紫',
  'palette.pink': '粉',
  'palette.selected': '{name}(已选)',
  'palette.unselected': '{name}(未选)'
}
