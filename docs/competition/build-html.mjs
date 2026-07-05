// 一次性生成完整的创意产物 HTML,内嵌 15 张实际运行截图
// 每张图都展示一项有代表性的"特征"状态,覆盖:
//   训练入口、网格大小(3/5/8)、色块样式(纯/多)、形状(方/圆/异/圆润)、
//   模式(升/降/交替/Gorbov/色彩)、调色板大小、设置/历史/关于页
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'd:\\task\\code\\schulte\\docs\\competition'
const SS = (n) => readFileSync(join(DIR, 'screenshots', n)).toString('base64')

// 15 张截图全部读到内存(每张 ~30~200KB,总计 ~1.3MB)
const imgs = {
  s01: SS('01-home.png'),
  s02: SS('02-play-3x3.png'),
  s03: SS('03-play-5x5-standard.png'),
  s04: SS('04-play-5x5-multi-color.png'),
  s05: SS('05-play-5x5-circle.png'),
  s06: SS('06-play-5x5-irregular.png'),
  s07: SS('07-play-8x8.png'),
  s08: SS('08-play-desc.png'),
  s09: SS('09-play-alternating.png'),
  s10: SS('10-play-gorbov.png'),
  s11: SS('11-play-color-4x4.png'),
  s12: SS('12-play-color-5x5.png'),
  s13: SS('13-settings.png'),
  s14: SS('14-history.png'),
  s15: SS('15-about.png')
}

const dataUri = (k) => `data:image/png;base64,${imgs[k]}`

// "实际运行截图" 区块,15 张分 4 组,每组 2 张卡片,围绕同一特征对比
const shotsBlock = `
  <div class="shots">

    <!-- 组 1: 入口 + 入门 3×3 -->
    <figure>
      <img src="${dataUri('s01')}" alt="首页:训练模式入口" />
      <figcaption><b>① 首页 · 5 种模式入口</b><br/>经典升序 / 反向降序 / 交替模式 / 红黑双驱 / 色彩模式,3–8 阶网格自由切换。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s02')}" alt="3×3 入门" />
      <figcaption><b>② 3×3 入门训练</b><br/>9 格纯色方块,适合 7–12 岁儿童或首次接触的用户。已点击 1/2/3 三个数字,可见浅蓝高亮。</figcaption>
    </figure>

    <!-- 组 2: 5×5 标准 + 多彩色块 -->
    <figure>
      <img src="${dataUri('s03')}" alt="5×5 经典升序 纯色方块" />
      <figcaption><b>③ 5×5 · 经典升序 · 纯色方块</b><br/>默认样式,简洁易读;已点击 1–7,顶部"下一目标 8"提示下一步。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s04')}" alt="5×5 多彩色块" />
      <figcaption><b>④ 5×5 · 多彩色块 · 提高难度</b><br/>每格从 6 色调色板随机取色,显著提高视觉搜索难度(用户可设置中切换)。</figcaption>
    </figure>

    <!-- 组 3: 正圆 + 异形 -->
    <figure>
      <img src="${dataUri('s05')}" alt="5×5 正圆 多彩" />
      <figcaption><b>⑤ 5×5 · 正圆形状 · 多彩</b><br/>正圆外观 + 多彩色块,辨识度更高的同时更具视觉趣味。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s06')}" alt="5×5 异形 多彩" />
      <figcaption><b>⑥ 5×5 · 异形 · 多彩</b><br/>每格独立随机 border-radius,告别千篇一律的方格,适合追求新鲜感的用户。</figcaption>
    </figure>

    <!-- 组 4: 8×8 高阶 + 反向降序 -->
    <figure>
      <img src="${dataUri('s07')}" alt="8×8 高阶" />
      <figcaption><b>⑦ 8×8 · 高阶 · 64 格</b><br/>8 阶网格 + 圆润形状 + 多彩色,8×8 = 64 个数字,适合训练有素的用户挑战极限。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s08')}" alt="反向降序 5×5" />
      <figcaption><b>⑧ 5×5 · 反向降序 · N²→1</b><br/>倒序点击:25 → 24 → 23 ... 训练逆向搜索,适合多样化的训练计划。</figcaption>
    </figure>

    <!-- 组 5: 交替 + 红黑双驱 -->
    <figure>
      <img src="${dataUri('s09')}" alt="交替模式 5×5" />
      <figcaption><b>⑨ 5×5 · 交替模式 · 注意力分配</b><br/>小→大→小→大交替点击 (1, 25, 2, 24 ...),训练注意力的快速切换能力。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s10')}" alt="红黑双驱 5×5" />
      <figcaption><b>⑩ 5×5 · 红黑双驱 · 颜色×顺序双任务</b><br/>奇数红色、偶数黑色,需同时关注颜色与顺序,综合训练注意力分配与视觉搜索。</figcaption>
    </figure>

    <!-- 组 6: 色彩模式 4×4 + 5×5 -->
    <figure>
      <img src="${dataUri('s11')}" alt="色彩模式 4×4" />
      <figcaption><b>⑪ 色彩模式 4×4 · 4 色轮转</b><br/>不再"看数字",而是按颜色顺序点击(顶部提示"下一目标 红色"),训练颜色-顺序双任务能力。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s12')}" alt="色彩模式 5×5 6 色" />
      <figcaption><b>⑫ 色彩模式 5×5 · 6 色默认调色板</b><br/>默认 6 色调色板(红/橙/绿/蓝/紫/粉),调色板可多选至少 2 色,自定义训练难度。</figcaption>
    </figure>

    <!-- 组 7: 设置 + 历史 -->
    <figure>
      <img src="${dataUri('s13')}" alt="设置页" />
      <figcaption><b>⑬ 设置页</b><br/>主题、年龄段、严格模式、<b>点击后高亮</b>(已勾选)、音效、触感反馈、中心红点等全部可调。</figcaption>
    </figure>
    <figure>
      <img src="${dataUri('s14')}" alt="历史记录页" />
      <figcaption><b>⑭ 历史记录页</b><br/>所有记录存于 IndexedDB(离线可用),可按网格大小/模式筛选,查看最佳成绩与趋势。</figcaption>
    </figure>

    <!-- 组 8: 关于页 -->
    <figure>
      <img src="${dataUri('s15')}" alt="关于页" />
      <figcaption><b>⑮ 关于页 · 参考成绩表</b><br/>介绍舒尔特方格起源(德国心理学家 Walter Schulte,1960)、训练维度,以及按年龄段的参考成绩评级。</figcaption>
    </figure>

  </div>`

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>舒尔特方格 · 跨平台专注力训练 · TRAE AI 创造力大赛提案</title>
<style>
  :root{
    --bg:#0b1020;
    --bg2:#0f172a;
    --card:#111a36;
    --line:#1f2a4a;
    --text:#e5e7eb;
    --muted:#94a3b8;
    --primary:#6366f1;
    --primary2:#22d3ee;
    --accent:#f472b6;
    --good:#10b981;
    --warn:#f59e0b;
    --rose:#f43f5e;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:radial-gradient(1200px 800px at 80% -10%, #1e1b4b 0%, transparent 60%), radial-gradient(900px 600px at -10% 100%, #0e7490 0%, transparent 50%), var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; line-height:1.6}
  .wrap{max-width:1100px;margin:0 auto;padding:32px 24px 80px}
  header.hero{
    display:grid;grid-template-columns:1.2fr 1fr;gap:32px;align-items:center;
    padding:28px;border:1px solid var(--line);border-radius:24px;
    background:linear-gradient(135deg, rgba(99,102,241,.15), rgba(34,211,238,.10) 60%, transparent);
    box-shadow:0 30px 80px -30px rgba(99,102,241,.5);
  }
  @media (max-width:820px){ header.hero{grid-template-columns:1fr} }
  .badge{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:rgba(99,102,241,.15);color:#c7d2fe;font-size:12px;border:1px solid rgba(99,102,241,.4)}
  h1{font-size:42px;line-height:1.15;margin:14px 0 8px;letter-spacing:-.02em}
  h1 span.grad{background:linear-gradient(90deg,#a78bfa,#22d3ee,#f472b6);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lede{color:var(--muted);font-size:16px;margin:6px 0 18px}
  .cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
  .btn{padding:12px 18px;border-radius:12px;border:1px solid var(--line);background:#0b1228;color:#fff;text-decoration:none;font-weight:600;font-size:14px;cursor:pointer;transition:.2s}
  .btn:hover{transform:translateY(-1px)}
  .btn.primary{background:linear-gradient(90deg,#6366f1,#22d3ee);border:none;box-shadow:0 12px 30px -10px rgba(99,102,241,.6)}
  .btn.ghost{background:transparent}
  .meta{display:flex;gap:14px;flex-wrap:wrap;margin-top:18px;color:var(--muted);font-size:13px}
  .meta b{color:#fff;font-weight:600}

  /* Hero 真实截图 */
  .preview{position:relative;border:1px solid var(--line);border-radius:18px;padding:14px;background:var(--card);display:flex;flex-direction:column;gap:10px}
  .preview .top{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted)}
  .preview img{display:block;width:100%;height:auto;border-radius:10px;border:1px solid var(--line)}

  section{margin-top:48px}
  h2{font-size:24px;margin:0 0 14px;letter-spacing:-.01em}
  h2 small{font-weight:400;color:var(--muted);font-size:13px;margin-left:8px}
  .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  @media (max-width:820px){ .grid3{grid-template-columns:1fr} }
  .card{border:1px solid var(--line);border-radius:16px;padding:20px;background:var(--card)}
  .card h3{margin:0 0 8px;font-size:16px}
  .card p{margin:0;color:var(--muted);font-size:14px}
  .pill{display:inline-block;padding:3px 10px;border-radius:999px;background:rgba(99,102,241,.18);color:#c7d2fe;font-size:11px;margin-right:6px}

  .modes{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
  @media (max-width:820px){ .modes{grid-template-columns:repeat(2,1fr)} }
  .mode{padding:14px;border:1px solid var(--line);border-radius:12px;background:#0b1228;text-align:center}
  .mode b{display:block;margin-bottom:4px}
  .mode span{color:var(--muted);font-size:12px}

  .platforms{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  @media (max-width:820px){ .platforms{grid-template-columns:1fr} }
  .plat{padding:18px;border:1px solid var(--line);border-radius:14px;background:#0b1228}
  .plat h4{margin:6px 0 6px;font-size:15px}
  .plat p{margin:0;color:var(--muted);font-size:13px}
  .plat .ico{font-size:24px}

  .timeline{border-left:2px dashed var(--line);padding-left:20px;margin:0}
  .timeline li{list-style:none;margin:0 0 16px;position:relative}
  .timeline li::before{content:"";position:absolute;left:-27px;top:6px;width:12px;height:12px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#22d3ee);box-shadow:0 0 0 3px #0b1020}
  .timeline b{color:#fff}
  .timeline span{color:var(--muted);font-size:13px;margin-left:8px}

  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}
  th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left}
  th{color:var(--muted);font-weight:500;font-size:12px}
  td.num{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}

  .value{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
  @media (max-width:820px){ .value{grid-template-columns:1fr} }

  /* 实际运行截图区块 */
  .shots{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  @media (max-width:820px){ .shots{grid-template-columns:1fr} }
  .shots figure{margin:0;border:1px solid var(--line);border-radius:16px;background:var(--card);padding:14px;display:flex;flex-direction:column;gap:10px}
  .shots figure img{width:100%;height:auto;border-radius:10px;border:1px solid var(--line);display:block}
  .shots figcaption{font-size:13px;color:var(--muted);line-height:1.5}
  .shots figcaption b{color:#fff}

  footer{margin-top:60px;padding-top:20px;border-top:1px solid var(--line);color:var(--muted);font-size:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
</style>
</head>
<body>
<div class="wrap">

  <header class="hero">
    <div>
      <span class="badge">🧠 专注力训练 · TRAE AI 创造力大赛提案</span>
      <h1>舒尔特方格 <span class="grad">跨平台专注力训练</span></h1>
      <p class="lede">
        基于 Tauri 2 + Vue 3 构建的现代舒尔特方格训练应用。一份代码，覆盖 <b>Web / PWA / Windows / macOS / Linux / iOS / Android</b> 7 大端，
        解决"找得到 App、玩不下去、跨端不通"的真实痛点。
      </p>
      <div class="cta">
        <a class="btn primary" href="#features">查看核心功能</a>
        <a class="btn ghost" href="#shots">查看实际运行截图</a>
      </div>
      <div class="meta">
        <span>🎯 <b>5</b> 种训练模式</span>
        <span>🧩 <b>3–8</b> 阶网格自由切换</span>
        <span>🎨 <b>6</b> 色调色板可多选</span>
        <span>📱 <b>7</b> 大端覆盖</span>
        <span>🧪 <b>43+</b> 单元测试</span>
      </div>
    </div>

    <div class="preview" aria-label="应用首页预览">
      <div class="top"><span>📱 首页 · 5×5 · 经典升序</span><span>实时截图</span></div>
      <img src="${dataUri('s01')}" alt="舒尔特方格首页截图" />
    </div>
  </header>

  <section id="features">
    <h2>核心功能 <small>5 种训练模式 + 高度可定制</small></h2>
    <div class="modes">
      <div class="mode"><b>经典升序</b><span>1 → N² 顺序点击</span></div>
      <div class="mode"><b>反向降序</b><span>N² → 1 倒序点击</span></div>
      <div class="mode"><b>交替模式</b><span>小→大→小交替</span></div>
      <div class="mode"><b>红黑双驱</b><span>颜色 × 顺序双任务</span></div>
      <div class="mode"><b>色彩模式</b><span>按调色板轮转</span></div>
    </div>

    <div class="grid3" style="margin-top:16px">
      <div class="card">
        <h3>🎨 多色调色板</h3>
        <p>红 / 橙 / 绿 / 蓝 / 紫 / 粉 6 色，<b>可多选</b>(至少 2 色)，用户自定义色彩训练难度，告别"只能死记数字"。</p>
      </div>
      <div class="card">
        <h3>🟦 多彩色块</h3>
        <p>数字模式支持 <b>纯色 / 多彩</b> 两种样式，色块从调色板随机取色，多彩模式显著提高搜索难度。</p>
      </div>
      <div class="card">
        <h3>🔘 不规则形状</h3>
        <p>方块 / 圆润 / 正圆 / 异形 四种形状；"异形"每格独立随机，告别千篇一律的方格。</p>
      </div>
      <div class="card">
        <h3>📊 严格模式 + 错题统计</h3>
        <p>点错时格子短暂红色高亮 + 抖动；记录错误次数并按年龄段自动评级(优秀 / 良好 / 中等 / 较弱)。</p>
      </div>
      <div class="card">
        <h3>💾 本地历史 + 离线可用</h3>
        <p>所有记录存于 <b>IndexedDB</b>(离线可用)，可查看最佳成绩与趋势；PWA 支持安装到桌面/主屏。</p>
      </div>
      <div class="card">
        <h3>⚡ 一份代码 7 端</h3>
        <p>基于 Tauri 2 跨端框架 + Vite 构建；桌面 / 移动 / Web 行为一致，数据互不打通也能各自流畅。</p>
      </div>
    </div>
  </section>

  <section id="shots">
    <h2>实际运行截图 <small>15 个关键场景 · 来自本地构建产物 · vue-tsc &amp; vitest 全绿</small></h2>
    ${shotsBlock}
  </section>

  <section>
    <h2>参考成绩 <small>5×5 网格 · 按年龄段自动评级</small></h2>
    <div class="card">
      <table>
        <thead><tr><th>年龄段</th><th>优秀</th><th>良好</th><th>中等</th><th>较弱</th></tr></thead>
        <tbody>
          <tr><td>7–12 岁</td><td class="num">&lt; 26s</td><td class="num">26–42s</td><td class="num">42–50s</td><td class="num">&gt; 50s</td></tr>
          <tr><td>12–17 岁</td><td class="num">&lt; 16s</td><td class="num">16–26s</td><td class="num">26–36s</td><td class="num">&gt; 36s</td></tr>
          <tr><td>18+ 岁</td><td class="num">&lt; 8s</td><td class="num">8–20s</td><td class="num">20–30s</td><td class="num">&gt; 30s</td></tr>
        </tbody>
      </table>
      <p style="color:var(--muted);font-size:12px;margin:8px 0 0">其他网格大小按 N²/25 等比缩放评级阈值。</p>
    </div>
  </section>

  <section>
    <h2>目标用户与痛点</h2>
    <div class="value">
      <div class="card">
        <h3>👨‍👩‍👧 家长与中小学生</h3>
        <p>想让孩子每天 5–10 分钟练专注力，但市面 App 广告多、要付费、要注册，且仅在手机端可用。iPad / 电脑端体验割裂。</p>
      </div>
      <div class="card">
        <h3>🧑‍💻 知识工作者 / 程序员 / 备考党</h3>
        <p>工作学习时容易走神、想找一个轻量、无干扰、跨端同步的训练工具，市面工具要么太花哨、要么功能单一。</p>
      </div>
      <div class="card">
        <h3>🏫 培训老师 / 学校</h3>
        <p>需要把舒尔特训练嵌入教学场景，希望在白板/电脑/平板上都能用，不需要安装即可体验。</p>
      </div>
      <div class="card">
        <h3>♿ 老年认知训练</h3>
        <p>随着年龄增长需要保持注意力与视觉搜索能力，需要<b>大字号、低干扰、可调节</b>的版本。</p>
      </div>
    </div>
  </section>

  <section>
    <h2>价值与意义</h2>
    <div class="value">
      <div class="card">
        <h3>🧪 教育价值</h3>
        <p>舒尔特方格是经过 60 多年验证的注意力训练方法，被多国教育系统采纳。本应用将这一经典工具数字化、可量化(按年龄评级)，并支持<b>渐进式难度</b>。</p>
      </div>
      <div class="card">
        <h3>📈 效率价值</h3>
        <p>一份代码 7 端，避免在不同平台重复实现；PWA 离线可用 + IndexedDB 本地存储，<b>零账号零广告</b>，打开即用。</p>
      </div>
      <div class="card">
        <h3>🤝 社会价值</h3>
        <p>提供完全免费、无干扰的工具，帮助有需要的家庭与个人坚持训练；开源核心游戏逻辑，鼓励教育领域二次开发。</p>
      </div>
      <div class="card">
        <h3>💡 创新价值</h3>
        <p>在传统舒尔特基础上增加 <b>色彩模式 / 多彩色块 / 不规则形状</b>，让训练更有趣、更可定制，降低重复训练的厌倦感。</p>
      </div>
    </div>
  </section>

  <section>
    <h2>技术路线 <small>Tauri 2 + Vue 3 + Vite + TypeScript + Pinia + Dexie + PWA</small></h2>
    <div class="card">
      <ul class="timeline">
        <li><b>核心游戏逻辑</b><span>utils/shuffle.ts、mode.ts、rating.ts、colorPalette.ts，纯函数 + 完整单元测试(Vitest, 43+ 用例)</span></li>
        <li><b>状态管理</b><span>Pinia 三个 store: settings / game / history，所有用户偏好持久化到 localStorage / IndexedDB</span></li>
        <li><b>UI 渲染</b><span>Vue 3 + Tailwind CSS，响应式布局(手机 / 平板 / 桌面一套组件)</span></li>
        <li><b>Web / PWA</b><span>Vite + vite-plugin-pwa，支持 Service Worker 离线缓存与桌面/主屏安装</span></li>
        <li><b>跨端</b><span>Tauri 2 打包 Windows / macOS / Linux 桌面，以及 iOS / Android 原生应用</span></li>
        <li><b>类型安全</b><span>TypeScript 严格模式，vue-tsc 零错误检查通过</span></li>
      </ul>
    </div>
  </section>

  <section>
    <h2>支持平台 <small>一份代码 · 7 端一致体验</small></h2>
    <div class="platforms">
      <div class="plat"><div class="ico">🌐</div><h4>Web / PWA</h4><p>Chrome / Edge / Safari / Firefox 任意浏览器，支持离线与安装到桌面/主屏</p></div>
      <div class="plat"><div class="ico">🪟</div><h4>Windows</h4><p>Tauri 2 打包为 .msi / .exe，体积小，启动快</p></div>
      <div class="plat"><div class="ico">🍎</div><h4>macOS</h4><p>.dmg / .app 原生包，适配 Apple Silicon 与 Intel</p></div>
      <div class="plat"><div class="ico">🐧</div><h4>Linux</h4><p>.deb / .AppImage，覆盖主流发行版</p></div>
      <div class="plat"><div class="ico">📱</div><h4>iOS</h4><p>Tauri 2 iOS 目标，提交 App Store 或 TestFlight 内测</p></div>
      <div class="plat"><div class="ico">🤖</div><h4>Android</h4><p>.apk / .aab，Google Play 与国内应用市场均可分发</p></div>
    </div>
  </section>

  <section id="roadmap">
    <h2>为什么做这个方向 <small>写在最后</h2>
    <div class="card">
      <p>舒尔特方格是一个简单、朴素、有效的训练方法，但市面产品普遍存在:</p>
      <ul style="color:var(--muted);margin:8px 0 0 18px">
        <li><b>广告多、需注册、需付费</b> —— 本应用零广告、零注册、零付费</li>
        <li><b>只在单一平台</b> —— 本应用 7 端覆盖，家里电脑、公司平板、地铁手机，行为一致</li>
        <li><b>玩法单一、容易厌倦</b> —— 5 种模式 + 可调调色板 + 多种色块/形状，提高可玩性</li>
        <li><b>无训练反馈</b> —— 按年龄自动评级 + 错题统计 + 最佳成绩趋势，帮用户量化进步</li>
      </ul>
      <p style="margin-top:14px;color:var(--muted)">这次借 TRAE AI 创造力大赛的机会，把零散的需求整理成一个完整、可体验、跨端可用的产品 Demo，并附上完整的开发过程记录(关键步骤截图 + Session ID)。</p>
    </div>
  </section>

  <footer>
    <span>舒尔特方格 · Cross-platform Schulte Grid · v0.1.0</span>
    <span>Made with focus · Built with TRAE</span>
  </footer>
</div>
</body>
</html>
`

const outPath = join(DIR, 'creative-proposal.html')
writeFileSync(outPath, html, 'utf8')
const sz = statSync(outPath).size
console.log(`Written: ${outPath}`)
console.log(`Size:    ${sz} bytes (${(sz/1024).toFixed(1)} KB)`)
let totalB64 = 0
for (const k of Object.keys(imgs)) totalB64 += imgs[k].length
console.log(`Images:  ${Object.keys(imgs).length} 张,共 ${(totalB64/1024).toFixed(1)} KB base64`)
