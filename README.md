# 个人简历网站

一个专业、现代的个人简历与作品集网站，采用数据驱动架构，支持主题切换与响应式设计。

## 项目特点

- **数据驱动**：所有内容集中在 `data/profile.json`，便于维护
- **主题切换**：支持浅色/深色模式，自动保存用户偏好
- **响应式设计**：完美适配桌面、平板、移动设备
- **性能优化**：静态站点，快速加载
- **工程化架构**：清晰的文件结构，易于扩展

## 技术栈

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- 无需构建工具，直接部署

## 项目结构

```
.
├── index.html          # 主页面
├── data/
│   └── profile.json    # 数据层（所有个人信息）
├── styles/
│   ├── main.css        # 主样式
│   └── theme.css       # 主题样式
├── scripts/
│   ├── main.js         # 主要交互逻辑
│   └── theme.js        # 主题切换逻辑
└── README.md           # 项目文档
```

## 本地预览

### 方式一：直接打开 HTML

直接双击 `index.html` 文件在浏览器中打开（注意：由于 CORS 限制，JSON 数据可能无法加载，建议使用本地服务器）。

### 方式二：使用本地服务器（推荐）

#### Python
```bash
# Python 3
python -m http.server 8000

# 访问 http://localhost:8000
```

#### Node.js (使用 http-server)
```bash
# 安装 http-server
npm install -g http-server

# 运行
http-server -p 8000

# 访问 http://localhost:8000
```

#### VS Code Live Server
1. 安装 VS Code 扩展 "Live Server"
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 部署到 Vercel

### 方法一：通过 Vercel Dashboard

1. 将项目代码推送到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. Vercel 会自动识别为静态站点并部署
6. 完成！

### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录运行
vercel

# 按照提示完成部署
```

### 方法三：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## 内容更新

所有内容都集中在 `data/profile.json` 文件中，修改以下内容即可：

- **个人信息**：`personal` 对象
- **教育背景**：`education` 对象
- **项目经历**：`projects` 数组
- **技能矩阵**：`skills` 数组
- **社交信息**：`social` 对象

修改后重新部署即可生效。

## 自定义配置

### 修改主题色

编辑 `styles/theme.css`，修改 CSS 变量：

```css
:root {
  --color-primary: #2563eb; /* 浅色模式主色 */
}

[data-theme="dark"] {
  --color-primary: #3b82f6; /* 深色模式主色 */
}
```

### 修改容器宽度

编辑 `styles/main.css`：

```css
:root {
  --container-width: 1200px; /* 修改为你需要的宽度 */
}
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 性能优化建议

- 所有静态资源使用 CDN（Vercel 自动提供）
- 图片建议使用 WebP 格式并压缩
- 如需 SEO 优化，可考虑添加 meta 标签或使用静态站点生成器

## 扩展建议

- 添加博客功能（可集成静态博客系统）
- 添加项目详情页面
- 集成分析工具（如 Google Analytics）
- 添加多语言支持
- 集成表单提交功能（可配合服务如 Formspree）

## License

MIT

---

Built with attention to detail. ✨

