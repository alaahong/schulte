/**
 * 微信小程序入口
 * 当前是 web-view 套壳方案,所有业务在 H5 站点中
 * 这里的 App() 仅用于全局生命周期(暂未使用)
 */
App({
  onLaunch() {
    // 小程序启动,可在此处打点或初始化本地存储
    // console.log('[schulte-mp] onLaunch', new Date().toISOString())
  },
  onShow() {
    // 切前台
  },
  onHide() {
    // 切后台
  },
  onError(err) {
    console.error('[schulte-mp] runtime error:', err)
  }
})
