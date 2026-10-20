# 格物实验室 gewu-lab

面向浙江高考的历史、数学、地理交互学习网站（纯静态，无需构建）。

## 目录
- `index.html` 门户首页
- `func/` 函数图像 · `conic/` 圆锥曲线 · `geo/` 立体几何
- `earth/` 地球运动 · `atmos/` 大气环流 · `water/` 水循环

## 部署到 Cloudflare Pages
1. Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git，选择本仓库 `gewu-lab`。
2. Framework preset 选 None；Build command 留空；Build output directory 填 `/`。
3. Save and Deploy，得到 `*.pages.dev` 地址。
4. Custom domains → Set up a custom domain，填你的域名并按提示加 DNS 记录。

以后每次推送到 `main` 会自动重新部署。3D 演示通过 CDN 加载 three.js，需联网。
