# cxx-ui 图标库

透明背景、4 状态交互的 SVG 图标集合,跟 cxx-repodock 视觉风格保持一致。

## 快速开始

克隆仓库后,无需安装任何依赖(Node.js 内置模块即可):

```powershell
# Windows PowerShell
.\scripts\start.ps1
```

```bash
# macOS / Linux / Windows
node scripts/start.mjs
# 或
npm start
```

服务启动后会自动打开浏览器到 `http://127.0.0.1:4173/`,展示所有图标的 4 状态、文件名、编号,支持搜索过滤、文件名点击复制。

修改 `icons/` 下的任何 SVG 后,刷新浏览器即可看到效果,无需重启服务。

## 自定义

| 环境变量 | 含义 | 默认值 |
|---|---|---|
| `CXX_UI_PORT` | 监听端口 | `4173` |
| `CXX_UI_NO_BROWSER` | 设为 `1` 时不自动打开浏览器 | 未设置 |

```powershell
# 改端口
$env:CXX_UI_PORT = 8080
.\scripts\start.ps1

# 远程 / 无 GUI 环境,不打开浏览器
$env:CXX_UI_NO_BROWSER = "1"
.\scripts\start.ps1
```

## 目录结构

```text
cxx-ui/
├── icons/                 # 图标资产(每个图标 4 状态)
│   ├── 01-settings.svg
│   ├── 01-settings-hover.svg
│   ├── 01-settings-active.svg
│   └── 01-settings-disabled.svg
├── prototype/             # 本地原型展示页
│   └── index.html
├── scripts/               # 启动脚本
│   ├── start.mjs          # 跨平台 Node.js 入口
│   └── start.ps1          # Windows PowerShell 入口
├── package.json
└── README.md
```

## 图标规范

每个图标固定 4 状态文件,命名 `NN-name[-state].svg`:

| 文件 | 含义 |
|---|---|
| `NN-name.svg` | 默认状态 |
| `NN-name-hover.svg` | 鼠标悬停 |
| `NN-name-active.svg` | 鼠标按下 |
| `NN-name-disabled.svg` | 不可用 |

- `NN` 是两位编号(`01`-`99`),`name` 是小写连字符语义(`settings`、`file-folder` 等)
- viewBox 统一 `0 0 56 56`,源文件 `width="56" height="56"`
- 不允许 `<script>`、`<foreignObject>`、外链 `href`、`url()`、`onload`/`onclick`
- 实色填色,同色系 3 档明度(default / hover / active)

## 新增图标

1. 在 `icons/` 添加 `NN-name.svg` + 3 个状态文件(共 4 个)
2. 浏览器刷新即可看到新条目
3. 编号要唯一,命名遵循小写连字符

## 依赖

- Node.js 14+(只需要内置的 `http`、`fs`、`path`、`url`、`child_process` 模块,无需 `npm install`)
- 任何带 GUI 的浏览器(自动打开用)
