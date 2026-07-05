# Schulte Grid · 舒尔特方格

> Cross-platform Schulte Grid attention-training app. Web / PWA / Desktop / Android / iOS — one codebase.
> 跨平台舒尔特方格注意力训练应用 · Web / PWA / 桌面 / Android / iOS 一份代码。

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vitejs.dev)
[![Tauri 2](https://img.shields.io/badge/Tauri-2-ffc131)](https://tauri.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-0ea5e9)](https://alaahong.github.io/schulte/)

**English** | [中文](#中文)

A focus-training app built around the classic Schulte Grid (5×5 random digits, tap 1→25 in order as fast as possible). It runs in any modern browser, can be installed as a PWA, and ships as a native desktop/mobile app via Tauri 2.

---

## ✨ Features

- **5 training modes** — Ascending / Descending / Alternating / Gorbov (red-black) / Color
- **3×3 → 8×8 grids** — Beginner to advanced, switch on the fly
- **Multi-select color palette** — 6 colors (red/orange/green/blue/purple/pink), at least 2 required
- **Solid & multi-fill styles** — White (default) or random multi-color cells
- **4 cell shapes** — Square (default), Rounded, Circle, Irregular
- **Strict mode** — Wrong tap shakes + flashes + ends the run (optional)
- **Age-aware rating** — 7–12 / 12–17 / 18+ reference times
- **Local-first history** — IndexedDB (Dexie), works fully offline
- **PWA installable** — Add to home screen on iOS / Android / Desktop
- **Bilingual UI** — 🇨🇳 简体中文 / 🇺🇸 English, auto-detect from browser
- **No ads, no signup, no payment**

## 🌐 Live Demo

The app auto-deploys to GitHub Pages from `main`:

```
https://alaahong.github.io/schulte/
```

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Dev server (http://localhost:5173)
npm run dev

# 3. Type check + unit tests
npm test

# 4. Production build → dist/
npm run build
```

## 📦 Deploy to GitHub Pages

Two CI workflows live under `.github/workflows/`:

- **`deploy.yml`** — On every push to `main`, builds `dist/` and publishes to GitHub Pages.
- **`release.yml`** — On `git tag v*.*.*`, builds Windows / macOS / Linux / Android / iOS artifacts and attaches them to a Draft Release.

### First-time setup

1. Push the repo to GitHub.
2. Open **Settings → Pages** on the repo.
3. Under **Source**, choose **GitHub Actions** (not "Deploy from a branch").
4. The next push to `main` will trigger `deploy.yml` and the app will be live at
   `https://<your-username>.github.io/schulte/` within a couple of minutes.

The Vite `base` is auto-derived from `GITHUB_REPOSITORY`, so the same workflow works whether the repo is named `schulte`, `schulte-grid`, or anything else.

## 🖥️ Native Builds (Tauri 2)

| Platform | Artifact | Runner |
|----------|----------|--------|
| Windows  | `.msi` / `.exe` | `windows-latest` |
| macOS    | `.dmg` (universal: Apple Silicon + Intel) | `macos-latest` |
| Linux    | `.deb` / `.AppImage` | `ubuntu-22.04` |
| Android  | `.apk` (debug-signed) | `ubuntu-22.04` |
| iOS      | `.app` (unsigned, sign before distribution) | `macos-latest` |

```bash
# Trigger via git tag
git tag v0.1.0 && git push origin v0.1.0

# Or via the GitHub UI: Actions → Release Build → Run workflow
```

Local native builds require the Rust toolchain plus the relevant platform SDK (MSVC for Windows, Xcode for iOS/macOS, Android Studio + JDK 17 for Android).

## 🛠️ Tech Stack

- **Frontend** — Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS
- **Storage** — Dexie (IndexedDB)
- **PWA** — vite-plugin-pwa
- **Cross-platform** — Tauri 2 (Rust + WebView)
- **i18n** — built-in lightweight `t()` (no extra dep)
- **Tests** — Vitest (40+ unit tests)

## 📁 Project Layout

```
schulte/
├── .github/workflows/        CI: deploy to Pages + multi-platform release
├── docs/competition/         Contest deliverables (proposal, screenshots, posts)
├── public/                   PWA icons + 404.html (SPA fallback)
├── src/
│   ├── views/                Home / Play / History / Settings / About
│   ├── stores/               Pinia: settings / game / history
│   ├── utils/                Game logic + unit tests
│   ├── i18n/                 Locales: zh-CN / en-US
│   ├── router/               Vue Router (SPA)
│   └── App.vue / main.ts     Entry
├── src-tauri/                Tauri config + Rust entry
└── vite.config.ts            Vite + PWA (auto base path)
```

## 🧪 Tests

```bash
npm test         # Vitest unit tests
npm run test:e2e # Playwright (optional)
```

## 📄 License

MIT

---

<a name="中文"></a>

# 舒尔特方格 · Schulte Grid

> 跨平台舒尔特方格注意力训练应用。Web / PWA / 桌面 / Android / iOS —— 一份代码。

**中文** | [English](#schulte-grid--舒尔特方格)

基于经典舒尔特方格（5×5 数字随机排列，按 1→25 顺序点击，越快越好）打造的专注力训练应用。可以在任何现代浏览器中运行，支持安装为 PWA，也能通过 Tauri 2 打包为原生桌面 / 移动端 App。

## ✨ 核心特性

- **5 种训练模式** — 经典升序 / 反向降序 / 交替模式 / 红黑双驱 / 色彩模式
- **3×3 ~ 8×8 网格** — 入门到高阶，自由切换
- **多色调色板** — 6 色（红 / 橙 / 绿 / 蓝 / 紫 / 粉）可多选，至少 2 色
- **纯色 / 多彩色块** — 默认白底，可切换为随机多彩
- **4 种单元形状** — 方块（默认）/ 圆润 / 正圆 / 异形
- **严苛模式** — 错题抖动 + 红色高亮，可选立即结束
- **按年龄段评级** — 7-12 / 12-17 / 18+ 三档参考成绩
- **本地历史 + 离线** — IndexedDB (Dexie) 存储，离线可用
- **PWA 可安装** — 支持 iOS / Android / 桌面添加到主屏
- **中英双语界面** — 🇨🇳 简体中文 / 🇺🇸 English，根据浏览器自动选择
- **零广告、零注册、零付费**

## 🌐 在线演示

应用会从 `main` 分支自动部署到 GitHub Pages：

```
https://alaahong.github.io/schulte/
```

## 🚀 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（http://localhost:5173）
npm run dev

# 3. 类型检查 + 单元测试
npm test

# 4. 生产构建（产物在 dist/）
npm run build
```

## 📦 发布到 GitHub Pages

仓库内置两个 CI：

- **`deploy.yml`** — 每次 push 到 `main` 时自动构建 `dist/` 并发布到 GitHub Pages。
- **`release.yml`** — 推送 `git tag v*.*.*` 时构建 Windows / macOS / Linux / Android / iOS 产物，并附到 **Draft Release**。

### 首次启用

1. 把代码推送到 GitHub。
2. 打开仓库 **Settings → Pages**。
3. **Source** 选择 **GitHub Actions**（不是 "Deploy from a branch"）。
4. 下一次 push 到 `main` 就会自动触发 `deploy.yml`，几分钟后可在
   `https://<your-username>.github.io/schulte/` 访问。

Vite 的 `base` 路径会根据 `GITHUB_REPOSITORY` 环境变量自动推导，因此无论仓库叫 `schulte` 还是 `schulte-grid` 都能正确部署。

## 🖥️ 原生打包（Tauri 2）

| 平台       | 产物                                          | Runner            |
|------------|-----------------------------------------------|-------------------|
| Windows    | `.msi` / `.exe`                               | `windows-latest`  |
| macOS      | `.dmg`（universal：Apple Silicon + Intel）    | `macos-latest`    |
| Linux      | `.deb` / `.AppImage`                          | `ubuntu-22.04`    |
| Android    | `.apk`（debug 签名）                          | `ubuntu-22.04`    |
| iOS        | `.app`（未签名，分发前需自行签名）            | `macos-latest`    |

```bash
# 通过 tag 触发
git tag v0.1.0 && git push origin v0.1.0

# 或在 GitHub 网页端：Actions → Release Build → Run workflow
```

本机构建需要安装 Rust 工具链 + 对应平台 SDK（Windows 需 MSVC，iOS 需 Xcode，Android 需 Android Studio + JDK 17）。

## 🛠️ 技术栈

- **前端** — Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS
- **存储** — Dexie (IndexedDB)
- **PWA** — vite-plugin-pwa
- **跨端** — Tauri 2（Rust + WebView）
- **国际化** — 自研轻量 `t()` 函数（零额外依赖）
- **测试** — Vitest（40+ 单元测试）

## 📁 项目结构

```
schulte/
├── .github/workflows/        GitHub Actions:Pages 自动部署 + 多平台打包
├── docs/competition/         比赛相关产物
├── public/                   PWA icons + 404.html（SPA fallback）
├── src/
│   ├── views/                Home / Play / History / Settings / About
│   ├── stores/               Pinia:settings / game / history
│   ├── utils/                核心游戏逻辑 + 单元测试
│   ├── i18n/                 翻译资源:zh-CN / en-US
│   ├── router/               Vue Router (SPA 路由)
│   └── App.vue / main.ts     入口
├── src-tauri/                Tauri 配置 + Rust 入口
└── vite.config.ts            Vite + PWA 配置(自动 base 路径)
```

## 🧪 测试

```bash
npm test         # 单元测试(Vitest)
npm run test:e2e # E2E(Playwright,可选)
```

## 📄 License

MIT
