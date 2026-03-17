# 🐍 诺基亚贪吃蛇游戏

一个复古风格的像素贪吃蛇游戏，完美复刻经典诺基亚手机体验。

![Game Preview](https://img.shields.io/badge/Game-Snake-green)
![Tech](https://img.shields.io/badge/Tech-HTML5%20Canvas-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎮 在线试玩

### 方式一：GitHub Pages（推荐）
访问：https://您的用户名.github.io/仓库名

### 方式二：Netlify Drop（最简单）
1. 打开 https://app.netlify.com/drop
2. 将整个项目文件夹拖拽到网页中
3. 立即获得在线链接！

### 方式三：本地运行
直接双击 `index.html` 即可在浏览器中运行。

## 🎯 游戏特性

- ✅ 复古诺基亚手机外观
- ✅ 绿色背光LCD屏幕效果
- ✅ 像素风格渲染
- ✅ 计分系统和最高分记录
- ✅ 渐进加速难度
- ✅ 暂停功能
- ✅ 8-bit 音效
- ✅ 键盘 + 触屏双控制

## 🕹️ 操作说明

| 按键 | 功能 |
|------|------|
| ↑ ↓ ← → | 方向控制 |
| W A S D | 备选方向控制 |
| 空格 | 暂停/继续 |
| R | 重新开始 |
| 点击屏幕按键 | 触屏控制 |

## 🚀 部署方法

### GitHub Pages 部署

```bash
# 1. 在 GitHub 创建新仓库
# 2. 连接远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 3. 推送代码
git push -u origin master

# 4. 在仓库 Settings > Pages 中启用 GitHub Pages
# 5. 选择 Source: GitHub Actions
```

### Netlify 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod --dir=.
```

## 📁 项目结构

```
snake-game/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式
├── js/
│   ├── constants.js    # 常量
│   ├── game.js         # 游戏逻辑
│   ├── renderer.js     # 渲染
│   └── audio.js        # 音效
└── .github/
    └── workflows/      # 自动部署
```

## 🛠️ 技术栈

- HTML5 Canvas
- CSS3
- JavaScript (ES6+)
- Web Audio API

## 📄 许可证

MIT License

---

使用 [Superpowers](https://github.com/obra/superpowers) 开发工作流构建
