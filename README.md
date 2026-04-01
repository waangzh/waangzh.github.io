# 个人简历网站

一个用于展示个人信息、项目经历与联系方式的静态网站。

## 设计说明

本项目在页面布局与部分视觉表达上，参考了 [WowYiJiu](https://www.wowyijiu.com/#contact) 网站的设计风格。

## 技术栈

- HTML5
- CSS3
- Vanilla JavaScript

## 项目结构

```text
.
├─ index.html
├─ resume.html
├─ data/
│  └─ profile.json
├─ assets/
├─ styles/
├─ scripts/
└─ README.md
```

## 本地预览

直接使用本地静态服务器打开项目目录即可，例如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署

可直接部署到 Vercel、GitHub Pages 或任意静态文件托管平台。
