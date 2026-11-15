# 格物实验室站点优化 — 2026-11-15

状态：已上线。`f1b273d` 合入 `main` 为 `1d638ad`，2026-11-15 推送后 https://isolated.uk 已换成这批文件。控制台没有需要删除的通配重写：未知地址已经返回 404。

逐条替换、新文件正文和删除清单在 [应用稿](2026-11-15-apply.md)。

## 上线规则

2026-11-15 起执行：每次改动先写入 `docs/changes/`，再上线。只写文档、不部署，不算做完。部署目标是 `gewu-lab` 的 `main`，不要把站点接到空的 `isolated.uk` 仓库。

## 范围

优化线上的 https://isolated.uk 。源码在公开仓库 `sheephess9527/gewu-lab`（`main`，最近内容提交 2026-11-01）。`sheephess9527/isolated.uk` 仍是空仓库，没有提交，不能当源码改。

本次只做不改实验内容的事：错误页、缓存、重复静态文件、首页首屏图、标题与描述、顶栏标题的标题级别、地球运动页的全元素过渡。不引入构建、框架或服务端。不合并 three.js 版本。不把 30 个实验收成一套壳。图片转 WebP 单列，等引用改完再删 JPG。

## 依据

2026-11-15 核对了线上站和 `gewu-lab` 的浅克隆。

- `https://isolated.uk/` 返回 200。`www` 301 到裸域。首页 HTML 约 32 KB，标题「格物实验室 · 面向浙江高考的交互学习」。
- 不存在的路径、`/robots.txt`、`/sitemap.xml`、`/favicon.ico` 都返回 200，正文与首页相同（31878 字节）。仓库根目录没有 `_redirects`、`404.html`、`robots.txt`、`sitemap.xml`。所以这条回退来自 Pages 项目或域名前面的重写，不在 Git 里。现有文件优先于通配重写；加上真实文件后，这些地址不应再落到首页。
- 首页 `LABS` 有 30 个实验、288 个章节：历史 11 / 109，地理 6 / 59，数学 13 / 120。抽查 `/yiguan/`、`/earth/`、`/conic/`、`/func/`、`/atlas/`、`/img/gw-hero.jpg` 均为 200。
- 仓库约 31.1 MB、273 个文件。JPG 23.71 MB（181 张），其中 78 张不少于 150 KB，合计 13.94 MB。HTML 3.87 MB，JS 2.94 MB。
- `https://gewu-lab.pages.dev` 与自定义域名是同一套内容。README 写「3D 演示通过 CDN 加载 three.js」，仓库里实际是本地三份 three.js。

## 决定

1. 缺页必须是 404，不能再把首页当成功页。加上 `404.html`、`robots.txt`、`sitemap.xml`、`favicon.svg`。不要添加 `/* /index.html 200`。若控制台已有这条重写，部署后要删掉，否则 `404.html` 不会生效。
2. 字节相同的公共文件收进 `/lib/`，实验页改相对路径，然后删除目录里的副本。`hark.css`、`hark-hero.css`、`hark.js` 没有相对 `url()` 或相对脚本地址，搬到 `/lib/` 不会断引用。`hark-hero.css` 的背景是 data URI。
3. 不合并 three.js。`contour/` 用 `three-0.128.0`，`water/` 用 `three-0.149.0`，其余三维页用 `three-0.147.0`。三份文件哈希不同。未逐页验证 API 之前删除旧版会弄坏实验。
4. 静态资源不要标 `immutable`。文件名没有内容哈希，改完 CSS 再缓存一年会卡住旧壳。`/lib/` 和图片用 1 天并重新验证；HTML 用 `max-age=0, must-revalidate`。
5. 手机上不请求首页英雄图。现在 `<img class="x-hero__img">` 在 734px 以下是 `display: none`，但 `src` 仍会下载，而且还标了 `fetchpriority="high"`。
6. 文档标题统一为「实验名 · 格物实验室」。描述用首页 `LABS.desc`，不新写文案。英文实验名留在 `en` 字段和代码里，从 `<title>` 和顶栏可见标题去掉。
7. 已有章节 `h1` 的页不再加第二个 `h1`。没有 `h1`、顶栏是 `div.tname` 或 `div.ttl` 的，改成带同样 class 的 `h1`，并补上桌面端 `font-size`，避免浏览器默认 2em。`func/`、`atlas/`、`contour/` 的可见标题嵌在按钮或品牌栏里，只加视觉隐藏的 `h1`，不动控件结构。
8. 只删 `earth/index.html` 里两条 `.x-app * { transition: ... }`。该页在 `prefers-reduced-motion` 下已经关掉过渡；问题是普通访问时每个节点都在做颜色过渡。面板和章节条自己的 `transition` 保留。
9. 「继续」只记 slug，不记章节。首页用 `LABS` 查出中文名。记不上 `localStorage` 时静默跳过。
10. WebP 是下一批。纪录片图由各目录 `cine-data.js` 的 `` art/${n}.jpg `` 引用，门户封面由 `index.html` 的 `img/gw-*.jpg` 引用。先生成 WebP 并改引用，确认页面仍显示，再删 JPG。这一批不把二进制写进 Markdown。

## 不做

- 不重写 30 个实验的壳，不统一 `data-theme` 和 `html.dark`。
- 不把 three.js 换回 CDN。教室网络下本地副本是对的，只是不能假装只有一份。
- 不改实验正文、题目、三维场景和章节数据。
- 不把文档写进 `quantized.uk`。那是另一个站。
- 不提交、不推送、不改 Cloudflare 控制台。空的 `isolated.uk` 仓库也不要拿来部署，否则会盖掉现在的 Pages 项目。

## 验证

2026-11-15 推送后立刻核对 https://isolated.uk 。`gewu-lab.pages.dev` 不是这次部署：它的标题是「格物实验室 · 初中理科 3D 实验」，缺页仍返回 200。线上站以 `isolated.uk` 为准。

已通过：

- `/robots.txt`、`/sitemap.xml`、`/favicon.svg`、`/lib/hark.css`、`/lib/last.js`、`/404.html` 均为 200，正文不再是首页。
- `/this-does-not-exist` 和 `/favicon.ico` 返回 404，正文是「这个页面不存在」，不是门户。
- `/earth/` 引用 `../lib/hark.css` 和 `three-0.147.0`。`/contour/` 仍是 `three-0.128.0`，`/water/` 仍是 `three-0.149.0`。
- `/yiguan/` 标题为「衣冠中国 · 格物实验室」。首页有「继续」导航，英雄图不再使用 `fetchpriority`。
- `/lib/hark.css` 的缓存是 `max-age=86400`。首页和 `/yiguan/` 是 `max-age=0, must-revalidate`。

未在浏览器里点选：手机是否不下载英雄图、无痕窗口是否不出现「继续」、顶栏字号、地球运动页的过渡手感。这些按应用稿实现，这次只核对了返回的 HTML。

- `https://isolated.uk/this-does-not-exist` 返回 404，正文是错误页，不是首页。
- `/robots.txt` 是文本，含 sitemap 地址。`/sitemap.xml` 是 XML，含首页和 30 个实验。`/favicon.svg` 是 SVG。三者都不再等于首页的 31878 字节。
- 从地球运动打开函数图像时，`/lib/hark.css` 只下载一次。实验目录下不再有 `hark.css`、`chart.js` 的副本。
- `contour/` 仍请求 `../lib/three-0.128.0/three.min.js`，`water/` 仍请求 `../lib/three-0.149.0/three.min.js`。
- 宽 390 的首页不请求 `img/gw-hero.jpg`。宽 1280 仍显示这张图，且有替代文本。
- 任一实验的 `<title>` 匹配「名称 · 格物实验室」。查看源代码能看到与首页卡片相同的 `description`。
- 衣冠中国顶栏仍是一行，字号不突然变大，元素为 `h1`。函数图像仍只有一个可见标题控件，另有一个视觉隐藏的 `h1`。
- 地球运动页在普通模式下拖动主题或切换章节不依赖全树颜色过渡；系统开启减弱动效时过渡仍关闭。
- 打开一个实验再回首页，「新上线」上方出现「继续」并链回该实验。无痕窗口不出现这颗药丸。
- 抽查历史、地理、数学各一页：章节能打开，三维页控制台没有 404 脚本。

## 文件清单

| 文件 | 作用 |
| --- | --- |
| `docs/changes/2026-11-15-site-optimization.md` | 本记录：范围、依据、决定、明确不做的事 |
| `docs/changes/2026-11-15-apply.md` | 新文件正文、路径替换、标题表、删除清单、WebP 规则 |
