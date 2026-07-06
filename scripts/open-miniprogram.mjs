#!/usr/bin/env node
/**
 * 提示用户在微信开发者工具中打开 miniprogram 目录
 *
 * 微信开发者工具是 GUI 应用,不能通过 CLI 直接打开,只能给出指引。
 * 但我们可以做:
 *   1. 验证 miniprogram 目录存在
 *   2. 输出绝对路径
 *   3. 给出可复制的指引
 *   4. macOS 上尝试 `open -a "WeChat Developer Tools"` 自动打开
 */

import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import { platform } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const mpPath = resolve(projectRoot, 'miniprogram')

if (!existsSync(mpPath)) {
  console.error(`✗ miniprogram 目录不存在: ${mpPath}`)
  process.exit(1)
}

console.log('')
console.log('📱 微信小程序打开指引')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`项目路径: ${mpPath}`)
console.log('')
console.log('步骤:')
console.log('  1. 启动「微信开发者工具」(没装先装: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)')
console.log('  2. 左侧扫码登录(测试号即可预览)')
console.log('  3. 菜单栏 → 项目 → 导入项目')
console.log('  4. 项目目录: 选择上面那个路径(整段复制)')
console.log('  5. AppID: 选「测试号」,或填你自己的')
console.log('  6. 项目名称: 舒尔特方格')
console.log('  7. 后端服务: 不使用云服务')
console.log('  8. 点「导入」即可在模拟器中预览')
console.log('')
console.log('💡 URL 在 miniprogram/pages/index/index.js 的 DEFAULT_URL 处修改')
console.log('💡 上传发布流程见 docs/wechat-miniprogram.md')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// macOS 上尝试自动拉起微信开发者工具
if (platform === 'darwin') {
  exec('open -a "WeChat Developer Tools" --args --project "' + mpPath + '"', (err) => {
    if (err) {
      console.log('(macOS 自动打开失败,请手动在微信开发者工具中导入项目)')
    }
  })
}
