# 微信小程序发布指南

> 适用于 [方案 B: web-view 套壳](../miniprogram/)。
> 业务逻辑 100% 在 H5 站中,小程序只做一层 web-view 容器。

---

## 0. 架构一览

```
┌─────────────────────────────┐
│  微信 (iOS / Android / PC)   │
│  ┌─────────────────────────┐ │
│  │ 微信小程序(套壳)         │ │  ← miniprogram/ 目录
│  │  ┌─────────────────────┐ │ │
│  │  │ <web-view>          │ │ │
│  │  │  H5 应用            │ │ │  ← GitHub Pages 部署的 H5
│  │  │  (vue-router, PWA)  │ │ │     https://alaahong.github.io/schulte/
│  │  └─────────────────────┘ │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- 训练数据(历史、设置)由 H5 站写入 `localStorage` / IndexedDB,小程序无独立存储
- 训练记录跟随 H5 站,跨端不互通(用户在小程序/H5 中训练,数据互不可见)
- 后续若要打通,可让 H5 调用 `wx.miniProgram.postMessage` 把数据传回小程序

---

## 1. 注册微信小程序账号

如果还没有小程序账号:

1. 打开 https://mp.weixin.qq.com/
2. 右上角「立即注册」→ 选「小程序」
3. 填写邮箱、密码、激活邮件(每个邮箱只能注册一次)
4. 主体类型二选一:
   - **个人**: 不需要营业执照,5 分钟搞定,功能受限(不能微信支付、不能分类导航)
   - **企业**: 需要营业执照,审核稍严,可解锁全部能力
5. 完成后获得 **AppID**(`wx...` 开头,16 位)与 **AppSecret**

> 💡 个人主体对 web-view 套壳完全够用,本应用不需要任何敏感接口。

---

## 2. 在本地预览(开发阶段)

### 2.1 安装微信开发者工具

https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2.2 导入项目

```bash
# macOS 自动打开(可选)
npm run miniprogram:open

# 或手动:
# 1. 启动「微信开发者工具」
# 2. 左侧扫码登录
# 3. 菜单栏 → 项目 → 导入项目
# 4. 项目目录: 项目根目录下的 miniprogram/
# 5. AppID: 选择「测试号」或填入你自己的
# 6. 项目名称: 舒尔特方格
# 7. 后端服务: 不使用云服务
# 8. 点「导入」
```

### 2.3 真机预览

开发者工具右上角 → 「预览」→ 扫码 → 在微信中打开。

---

## 3. 关键步骤:配置业务域名

> ⚠️ 这是最容易出错的一步。**没配置业务域名,真机预览会一直白屏**。

### 3.1 入口

微信公众平台(mp.weixin.qq.com)→ 登录 → 开发管理 → 开发设置 → 滑到「业务域名」

### 3.2 校验文件(关键)

微信要求你把一个特定文件放到域名根目录:

```
https://<你的域名>/MP_verify_xxxxxx.txt
```

文件内容形如:`abc123def456`(随机字符串,微信生成)。

**获取方式**:
- 在「业务域名」配置页面,点击「修改」,微信会显示一个文件下载链接
- 下载这个文件,得到 `MP_verify_xxxxxx.txt`

**放置方式** — 根据你选择的 URL 域名,二选一:

#### 选项 A: 使用 GitHub Pages 默认域名(推荐)

URL: `https://alaahong.github.io/schulte/`

- 把 `MP_verify_xxxxxx.txt` 放到 `public/` 目录下
- 提交后,GitHub Actions 会自动部署,文件出现在:
  `https://alaahong.github.io/schulte/MP_verify_xxxxxx.txt`
- 微信后台点「保存」自动校验,看到「已通过」即可

#### 选项 B: 使用自定义域名

URL: `https://www.ianzhang.cn/schulte/`

- 业务域名填 `www.ianzhang.cn`(不是子路径)
- 验证文件需放 `https://www.ianzhang.cn/MP_verify_xxxxxx.txt`
- 因为 `www.ianzhang.cn` 的根目录指向你的个人主页,不是 schulte 项目,
  你需要在个人主页的 web 服务器(`ianzhang.github.io` 仓库)的根目录放这个验证文件
- 或通过 CDN 静态文件托管也行

### 3.3 填写业务域名

- 填入要嵌入的根域名(不带协议、不带路径)
  - GitHub Pages: `alaahong.github.io`
  - 自定义域名: `www.ianzhang.cn`
- 微信会再次拉取 `https://<域名>/MP_verify_xxxxxx.txt` 验证
- 校验通过后保存

### 3.4 勾选不校验域名(仅开发)

如果只是开发阶段临时跑通,可以在微信开发者工具右上角 → 「详情」→ 「本地设置」中勾选:
- ✅ 不校验合法域名、web-view(业务域名)、TLS 版本以及 HTTPS 证书

这样**只在开发者工具模拟器**中能跳过校验,真机预览仍需配置。

---

## 4. 上传代码到微信后台

### 4.1 上传

1. 微信开发者工具右上角 → 「上传」
2. 填写版本号(例如 `1.0.0`)和项目备注
3. 上传后,在 mp.weixin.qq.com → 版本管理 → 开发版本 可看到刚刚的版本

### 4.2 提交审核

1. mp.weixin.qq.com → 版本管理 → 找到刚才的版本 → 「提交审核」
2. 填写审核信息:
   - **服务类目**: 教育 → 素质教育(或个人主体选: 工具 → 效率)
   - **标签**: 训练、专注力、注意力
   - **功能页面**: 已自动填入 `pages/index/index`
   - **测试账号**: 个人主体非必需
3. 提交后等待 1~3 个工作日

### 4.3 隐私配置(必填)

mp.weixin.qq.com → 设置 → 第三方设置 → 隐私协议

- **小程序用户隐私保护指引**: 必须填写
  - 必勾: 「开发者收集使用你的个人信息」(本应用收集设置、历史记录到本地)
  - 必勾: 「开发者收集使用你的设备信息」(本应用响应护眼模式读取系统主题)
- 保存后再次发布需要重新提交审核

### 4.4 发布

审核通过后 → 版本管理 → 找到审核通过版本 → 「发布」→ 立即生效,用户可在微信中搜索小程序名找到。

---

## 5. 替换或更新 URL

需要改小程序内嵌的 H5 地址时:

1. 编辑 `miniprogram/pages/index/index.js`
2. 改 `const DEFAULT_URL = '...'`
3. 提交代码 → 微信开发者工具刷新 → 重新上传 → 提交审核 → 发布

> 💡 URL 切换不需要重新审核业务域名,前提是新域名已在业务域名白名单。

---

## 6. 自动打包(GitHub Actions)

每次 push 到 `main`,GitHub Actions 会:

1. 跑 `npm run build` 生成 H5 dist/
2. 部署 dist/ 到 gh-pages 分支(GitHub Pages)
3. 把 `miniprogram/` 打成 `schulte-miniprogram.zip` 作为 workflow artifact
4. 保留 30 天,可在 GitHub Actions run 页面下载

下载后:
```bash
unzip schulte-miniprogram.zip -d my-mp-project
# 微信开发者工具 → 导入项目 → 选择 my-mp-project 目录
```

---

## 7. 限制与边界(必读)

| 限制 | 说明 |
|---|---|
| 无离线缓存 | web-view 内 PWA Service Worker 失效,首次进入必须联网 |
| 无长按分享 | 微信 web-view 禁用了 H5 的长按保存图片、识别二维码 |
| 无 JSSDK 推送 | 套壳版**不集成**微信 JSSDK,如需分享/支付/登录需改用 uni-app 真小程序方案 |
| 包体限制 | 微信主包 ≤ 2MB,本套壳包 < 10KB 完全够用 |
| 网络依赖 | 必须 HTTPS,内网/IP 直连都不行 |
| 域名白名单 | 切换 URL 必须同步更新业务域名配置,否则真机白屏 |

---

## 8. 常见问题

### Q1: 真机预览一直白屏,开发者工具里能打开
A: 业务域名没配。回到第 3 节。

### Q2: 报错「不在以下 request 合法域名列表中」
A: 这个错误是 H5 内部 fetch 触发的。本应用没用任何外部 fetch,可忽略;若坚持要排查,微信开发者工具详情 → 勾「不校验合法域名」可暂时绕过。

### Q3: 个人主体能用吗?有没有类目限制?
A: 能用。类目选「教育 → 素质教育」或「工具 → 效率」。本套壳没有支付、登录、广告、定位等敏感接口。

### Q4: 小程序里能用 Service Worker 离线吗?
A: 不能。web-view 是简化版浏览器,不支持 SW。但 H5 站本身在浏览器中支持 PWA 离线。

### Q5: 用户训练数据会丢失吗?
A: 不会。数据存在 H5 站的 localStorage / IndexedDB,用户后续在浏览器中访问 `alaahong.github.io/schulte/` 时能看到。但**小程序内清除缓存**会清除 H5 数据,这是 web-view 沙箱特性。

### Q6: 如何从 web-view 内返回小程序?
A: 默认没有「返回小程序」按钮。H5 站可通过 `wx.miniProgram.navigateBack()` 主动回退,本应用未启用,保持沉浸训练。

### Q7: 想做小程序原生 UI(按钮、tabBar、动画),怎么办?
A: 当前是 web-view 套壳,做不到。若需要,迁移到 uni-app 真小程序方案(参见 [项目主 README 的「跨端计划」](../README.md))。

---

## 9. 参考文档

- 微信小程序官方文档: https://developers.weixin.qq.com/miniprogram/dev/
- 业务域名配置: https://developers.weixin.qq.com/miniprogram/dev/framework/ability/domain.html
- web-view 组件: https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
- 微信小程序审核标准: https://developers.weixin.qq.com/miniprogram/product/
