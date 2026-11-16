# 格物实验室 gewu-lab

面向浙江高考的历史、数学、地理交互学习网站（纯静态，无需构建）。

## 目录
- `index.html` 门户首页。30 个实验的名称、描述和章节数以这里的 `LABS` 为准，不要在 README 再维护一份名单。
- 实验页在各自目录的 `index.html`。公共脚本和样式在 `lib/`。

## 部署到 Cloudflare Pages
1. Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git，选择本仓库 `gewu-lab`。
2. Framework preset 选 None；Build command 留空；Build output directory 填 `/`。
3. Save and Deploy，得到 `*.pages.dev` 地址。
4. Custom domains → Set up a custom domain，填你的域名并按提示加 DNS 记录。

以后每次推送到 `main` 会自动重新部署。变更先写入 `docs/changes/`，再推送 `main`。推送 `main` 就是上线。

三维演示使用仓库里的 three.js，不依赖外网 CDN。`contour/` 使用 0.128，`water/` 使用 0.149，其余三维实验使用 0.147。未逐页验证前不要合并这三份。公共壳子在 `lib/hark.css`、`lib/hark.js` 和 `lib/chart.js`，不要再往实验目录复制。

缺页由仓库根目录的 `404.html` 处理。不要在 Pages 或 `_redirects` 里把所有未知地址重写成 `index.html` 并返回 200。

门户封面和实验配图使用 WebP。新图不要再提交 JPG。
