# 微信小程序(套壳版)

> 这是 **方案 B** 的实现:`<web-view>` 内嵌 H5 站点,业务逻辑 100% 在 H5 站中。
> 完整发布指南: [docs/wechat-miniprogram.md](../docs/wechat-miniprogram.md)

## 快速预览

```bash
# 1. 装微信开发者工具(没装过的话)
#    https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 2. 启动后,菜单栏 → 项目 → 导入项目
#    项目目录: 本目录(整个 miniprogram/ 目录)
#    AppID: 选「测试号」即可

# 3. 或在 macOS 上跑
npm run miniprogram:open
```

## 切换 H5 站点 URL

打开 [pages/index/index.js](pages/index/index.js):

```js
// 默认 GitHub Pages
const DEFAULT_URL = 'https://alaahong.github.io/schulte/'

// 或自定义域名
// const DEFAULT_URL = 'https://www.ianzhang.cn/schulte/'
```

改完保存,微信开发者工具自动热重载。

## 上传发布

1. 业务域名配置: [完整指南 第 3 节](../docs/wechat-miniprogram.md#3-关键步骤配置业务域名)
2. 开发者工具右上角 → 「上传」→ 填版本号
3. mp.weixin.qq.com → 版本管理 → 提交审核
4. 1-3 个工作日审核通过 → 「发布」

## 目录结构

```
miniprogram/
  app.js                          # 小程序入口
  app.json                        # 全局配置
  app.wxss                        # 全局样式
  sitemap.json                    # 搜索配置(本项目禁用了)
  project.config.json             # 团队共享配置
  project.private.config.json     # 本地私有配置(已 gitignore,含 AppID)
  pages/
    index/
      index.js                    # 页面逻辑(改 URL 在这里)
      index.json                  # 页面配置
      index.wxml                  # <web-view>
      index.wxss                  # 页面样式
  README.md                       # 本文件
```
