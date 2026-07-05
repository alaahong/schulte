# 大赛参赛材料清单 · CHECKLIST

> 本文件汇总 TRAE AI 创造力大赛所需的全部材料,以及每项材料的位置 / 状态 / 待办事项。
> 投稿前请按本清单逐项打勾。

## 1. 报名阶段(2026/6/16 – 7/15)

### 1.1 报名帖 · 已就绪 ✅

- **位置**: [`01-registration-post.md`](./01-registration-post.md)
- **必填板块对照(参赛指南)**:
  - [x] 标签:`学习工作`
  - [x] 标题:`【学习工作赛道】舒尔特方格 · 跨平台专注力训练 —— 一份代码覆盖 Web / 桌面 / 移动 7 端,告别"找得到、玩不下去、跨端不通"`
  - [x] 1. 创意名称 + 创意介绍(想解决什么问题 / 为什么做 / 产品形态)
  - [x] 2. 目标用户及痛点(用户群 / 场景 / 当前痛点)
  - [x] 3. 价值与意义(教育 / 效率 / 社会 / 创新)
  - [x] 4. 附件:创意产物 HTML
- **附件**: [`creative-proposal.html`](./creative-proposal.html) —— **198.6 KB · 4 张实际运行截图以 base64 内嵌**,无需附带截图文件夹
- **已验证**: 用 Chrome 打开过,首屏 + 截图区均可正常显示
- **重新生成**(若截图有更新): `node build-html.mjs` 会重新读取 `screenshots/*.png` 并写入 `creative-proposal.html`

### 1.2 报名奖励 · 待领取

- 报名审核通过后,登录 [大赛官网](https://www.trae.cn/ai-creativity/result) 领取 **TRAE 中国版速通 Pro 月卡(价值 ¥99)+ 决赛现场门票**

---

## 2. 初赛阶段(2026/6/16 – 7/15)

### 2.1 初赛 Demo 帖 · 已就绪 ✅

- **位置**: [`02-demo-post.md`](./02-demo-post.md)
- **必填板块对照(初赛参赛指南)**:
  - [x] 标签:`学习工作`
  - [x] 标题:`【学习工作赛道】舒尔特方格 · 跨平台专注力训练 Demo —— 一份代码 7 端,5 种模式 + 可定制色块 / 形状`
  - [x] 1. Demo 简介(产品形态 / 用户 / 3 个核心功能)
  - [x] 2. Demo 创作思路(灵感 / 想解决的问题 / 为什么做这个方向)
  - [x] 3. Demo 体验地址(在线 / HTML / 视频 三选一)
  - [x] 4. TRAE 实践过程(流程 + ≥3 张截图 + ≥3 个 Session ID)
  - [x] 5. 报名帖链接(待审核通过后回填)

### 2.2 截图 · 已就绪 ✅

- **位置**: [`screenshots/`](./screenshots/)
- 已有截图:
  - [x] `01-home.png` —— 首页
  - [x] `02-play-asc-multi.png` —— 经典升序 5×5 · 多彩色块 · 异形
  - [x] `03-play-color.png` —— 色彩模式 4×4 · 4 色轮转
  - [x] `04-settings.png` —— 设置页
- **待办**:
  - [ ] 把这 4 张图上传到社区图床,获得可在帖子里直接引用的 URL
  - [ ] 在 Demo 帖里把 `screenshots/...png` 替换为社区图床 URL(直接拖入编辑器也可)
  - [ ] 如有需要,补充 1–2 张"训练中/历史记录/关于"页的截图,提升"展示过程"的丰富度

### 2.3 Session ID · 待补全

- **位置**: Demo 帖"4. TRAE 实践过程"小节
- **获取方式**: 双击 TRAE 对话头像即可复制 Session ID
- **当前状态**: 占位文本,需要在发帖前替换为真实 ID
- **建议至少 5 个**:
  - [ ] Session 1:需求澄清 + 技术选型
  - [ ] Session 2:核心游戏逻辑 + 单元测试
  - [ ] Session 3:UI 实现 + 状态管理 + 持久化
  - [ ] Session 4:跨端配置 Tauri 2 / PWA
  - [ ] Session 5:可定制化增强(多色/多色块/多形状)

### 2.4 体验地址 · 待部署

- **首选**: 在线 PWA 链接(HTTPS)
- **备选 1**: 仓库 `dist/index.html`(本地构建产物,需在 HTTPS 或 localhost 下访问以激活 PWA)
- **备选 2**: HTML 格式文件打包(20M 以内可直传社区)
- **当前状态**: `dist/` 已生成,待部署
- **待办**:
  - [ ] 部署到任意静态托管(Vercel / Netlify / Cloudflare Pages / Gitee Pages / 腾讯云 / 阿里云均可)
  - [ ] 把部署后的 HTTPS 链接填到 Demo 帖"3. Demo 体验地址"

---

## 3. 关键步骤截图补充建议(可选,提升"展示过程"丰富度)

> 初赛参赛指南建议"展示过程,而非只放结果"。除了已就绪的 4 张产品截图,
> 建议再补充 1–2 张"TRAE 实际开发过程"的截图,例如:
> - TRAE 对话窗口中规划 / 生成代码的截图
> - 终端运行 `vue-tsc --noEmit` / `vitest run` / `vite build` 的截图
> - 关键报错与修复的截图

- [ ] 补 1:需求澄清 + 技术选型的 TRAE 对话截图
- [ ] 补 2:核心游戏逻辑实现的代码/测试截图
- [ ] 补 3:Tauri 2 / PWA 跨端配置的截图
- [ ] 补 4:可定制化增强前后对比截图(可选)

---

## 4. 抖音人气通道(可选,多一次晋级机会)

- [ ] 在抖音发布与 Demo 相关的图文/视频,带话题 `#vibecoding大赏 #traeai创造力大赛` 并 @TRAE @抖音科技
- [ ] 填写 [TRAE AI 创造力大赛抖音人气通道作品收集](https://bytedance.larkoffice.com/share/base/form/shrcnzp18Sdf6XQxm8GPPXDt4b) 飞书问卷,有机会获得 5 万+ 流量扶持
- [ ] 同一作品可发多条,只取数据最高的一条计分(点赞 + 评论×2 + 收藏 + 转发),统计截止 7/15 23:59:59
- [ ] 最低门槛:单条内容点赞数 ≥ 500 才能进入人气榜计分

---

## 5. 报名帖链接(报名审核通过后回填)

- [ ] 报名帖 URL:_待审核通过后回填_

---

## 6. 提交前最终自检

- [ ] 报名帖 4 大板块齐全 + 创意产物 HTML 已上传
- [ ] Demo 帖 4 大板块齐全 + 体验地址可访问 + ≥3 张截图 + ≥3 个 Session ID + 报名帖链接
- [ ] 体验地址自己点过一遍,确认能正常打开并体验到核心功能
- [ ] 报名审核已通过 + 已去大赛官网"确认领取"奖励
- [ ] 抖音人气通道(可选)内容已发布 + 问卷已填

---

## 7. 参考资料

- 报名指南:[https://forum.trae.cn/t/topic/22548](https://forum.trae.cn/t/topic/22548)
- 初赛参赛指南:[https://forum.trae.cn/t/topic/22549](https://forum.trae.cn/t/topic/22549)
- 优秀作品排行榜:[https://forum.trae.cn/c/38-category/40-category/40/l/top](https://forum.trae.cn/c/38-category/40-category/40/l/top)
- 保姆级教程:[https://forum.trae.cn/t/topic/22569](https://forum.trae.cn/t/topic/22569)
- 赛事细则:[https://bytedance.larkoffice.com/wiki/DScwwZPzsikvNzk5slJc2kgpnie](https://bytedance.larkoffice.com/wiki/DScwwZPzsikvNzk5slJc2kgpnie)
- 抖音投稿指南:[https://bytedance.larkoffice.com/docx/GNo6dsdXuoi0nEx2zIFcs6ZUnnb](https://bytedance.larkoffice.com/docx/GNo6dsdXuoi0nEx2zIFcs6ZUnnb)
