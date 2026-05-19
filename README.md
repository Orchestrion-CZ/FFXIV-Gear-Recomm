# FFXIV Gear Recommender

一个静态的 FFXIV 装备/武器查询页面。可直接用 GitHub Pages、Nginx、Cloudflare Pages 等静态托管服务部署。

## 运行

本项目依赖 `fetch()` 读取 JSON，因此不要直接双击 `index.html` 预览。请用本地静态服务器打开：

```powershell
py -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## GitHub Pages

1. 把本目录里的文件上传到 GitHub 仓库。
2. 在仓库设置里打开 Pages。
3. Source 选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/root`。

## 目录说明

- `index.html`、`app.js`、`style.css`：前端页面。
- `gear-data.json`、`weapon-data.json` 等根目录 JSON：主要数据。
- `generated/`：页面运行时需要的索引 JSON。
- `images/`：图标、装备预览图、武器预览图。
- `docs/`：页面内弹窗会读取的帮助、更新与首次提示文档。

## 注意

完整图片目录体积较大。若 GitHub 普通仓库上传体验不好，可以考虑 Git LFS，或把图片放到 Releases/CDN 后再调整路径。
