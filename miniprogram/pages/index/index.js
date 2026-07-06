/**
 * 舒尔特方格 - 微信小程序(单页面 web-view 套壳)
 *
 * 关于 URL:
 *   1. 默认使用 GitHub Pages 默认域名(国内可能略慢但稳定)
 *   2. 备用是用户自定义域名(切换只需改 DEFAULT_URL)
 *   3. 使用前必须:
 *      a. 微信公众平台(mp.weixin.qq.com)→ 开发管理 → 开发设置
 *         → 「业务域名」配置 URL 一致
 *      b. 把验证文件 MP_verify_xxx.txt 放到该域名根目录
 *         (参见 docs/wechat-miniprogram.md 第 3 节)
 */

// ===== 站点 URL =====
// 切换 URL 只需改这一行;改完保存即可,微信开发者工具会热重载
const DEFAULT_URL = 'https://alaahong.github.io/schulte/'
// const DEFAULT_URL = 'https://www.ianzhang.cn/schulte/'  // 自定义域名备选

Page({
  data: {
    url: DEFAULT_URL,
    hint: false,
    hintTitle: '',
    hintBody: ''
  },

  onLoad() {
    // 首次进入:可以在这里加个 loading 提示,这里交给 web-view 内部处理
  },

  onShow() {
    // 切回前台时,如有错误提示,保持原状态不消失
  },

  /** web-view 加载完成(可作为首次渲染成功的信号) */
  onLoad(e) {
    // e.detail = { src }
    // console.log('[schulte-mp] web-view loaded:', e.detail)
  },

  /** web-view 加载失败(网络/域名/SSL 问题) */
  onError(e) {
    console.error('[schulte-mp] web-view error:', e)
    this.setData({
      hint: true,
      hintTitle: '页面加载失败',
      hintBody: `无法打开: ${this.data.url}\n\n可能原因:\n1. 网络问题\n2. 业务域名未在微信公众平台配置\n3. SSL 证书异常\n\n详细步骤见 docs/wechat-miniprogram.md`
    })
  },

  hideHint() {
    this.setData({ hint: false })
  },

  /** 用户从右上角菜单分享 */
  onShareAppMessage() {
    return {
      title: '舒尔特方格 · 专注力训练',
      path: '/pages/index/index',
      imageUrl: '' // 留空用默认截图
    }
  },

  /** 用户从聊天顶部分享到朋友圈 */
  onShareTimeline() {
    return {
      title: '舒尔特方格 · 每日 5-10 分钟专注力训练'
    }
  }
})
