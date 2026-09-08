# cxx-repodock 按钮图标系统(透明背景版)

**风格**:透明背景 · 实心填色 + 描边 · 跟 cxx-repodock 应用原图标风格一致(深色背景下显示效果一致)

每个图标 **4 个状态**:`default` / `hover` / `active` / `disabled` — 共 **200 个文件**(50 图标 × 4 状态)

---

## 状态配色(同色系 3 档明度)

| 状态 | 视觉 | 触发 |
|---|---|---|
| `default` | base 颜色 | 按钮静止 |
| `hover` | 同色**浅一档** | 鼠标经过 |
| `active` | 同色**深一档** | 鼠标按下 |
| `disabled` | 统一灰 `#868E96` | 不可点击 / 加载中 |

## 配色矩阵(9 主题)

| 主题 | default | hover | active | disabled | 用途 |
|---|---|---|---|---|---|
| 🟢 绿(拉/新建/好) | `#51CF66` | `#69DB7C` | `#37B24D` | `#868E96` | 拉/新建/对勾 |
| 🟦 青(Pull/分支) | `#22B8CF` | `#3BC9DB` | `#1098AD` | `#868E96` | Pull/分支/fetch |
| 🟦 蓝(Push/推/分支管理) | `#228BE6` | `#339AF0` | `#1971C2` | `#868E96` | Push/重命名分支 |
| 🔵 浅蓝(工具) | `#339AF0` | `#4DABF7` | `#228BE6` | `#868E96` | 搜索/帮助/reflog |
| 🟡 金黄(文件夹) | `#FAB005` | `#FCC419` | `#F08C00` | `#868E96` | 打开仓库 |
| 🟡 浅黄(文档) | `#FCC419` | `#FFD43B` | `#F08C00` | `#868E96` | 文件/历史 |
| 🟣 紫(配置/切换/压缩) | `#845EF7` | `#B197FC` | `#7048E8` | `#868E96` | 设置/切换分支/压缩 |
| ⚫ 灰(终端) | `#495057` | `#5C6770` | `#343A40` | `#868E96` | 终端 |
| 🔴 红(危险) | `#FA5252` | `#FF6B6B` | `#E03131` | `#868E96` | 删除/rebase/冲突 |

---

## 使用方式

### 方式 1:CSS 切换 `src`(推荐 · 文件独立,缓存友好)

```css
.btn-icon         { content: url('icons/10-pull.svg'); }
.btn-icon:hover   { content: url('icons/10-pull-hover.svg'); }
.btn-icon:active  { content: url('icons/10-pull-active.svg'); }
.btn-icon[disabled]{ content: url('icons/10-pull-disabled.svg'); }
```

### 方式 2:CSS 滤镜(单文件 · 快速接入)

```css
.btn-icon         { filter: none; }
.btn-icon:hover   { filter: brightness(1.15); }
.btn-icon:active  { filter: brightness(0.85); }
.btn-icon.disabled{ filter: grayscale(1) opacity(.5); }
```

### 方式 3:内联 SVG(单文件 · CSS 直接控色)

```html
<button class="btn">
  <svg viewBox="0 0 56 56" width="32" height="32">
    <line x1="28" y1="8" x2="28" y2="40" stroke="currentColor" ... />
  </svg>
</button>
<style>
  .btn { color: #22B8CF; }
  .btn:hover   { color: #3BC9DB; }
  .btn:active  { color: #1098AD; }
  .btn:disabled{ color: #868E96; }
</style>
```

---

## 50 个图标清单(按功能)

### A · 顶部通用(5)

| # | 文件名 | 含义 | base 色 |
|---|---|---|---|
| 01 | `settings` | 设置(齿轮) | 🟣 紫 |
| 02 | `help` | 帮助(问号) | 🔵 浅蓝 |
| 03 | `new-project` | 新建项目(+) | 🟢 绿 |
| 04 | `new-fork` | 新建派生(+) | 🟦 青 |
| 05 | `search` | 搜索(放大镜) | 🔵 浅蓝 |

### B · 工作盘操作(8)

| # | 文件名 | 含义 | base 色 |
|---|---|---|---|
| 06 | `open-repo` | 打开仓库(文件夹) | 🟡 金黄 |
| 07 | `terminal` | 终端(显示器+>) | ⚫ 灰 |
| 08 | `sync` | 同步(双向回旋) | 🟢 绿 |
| 09 | `file` | 文件(文档+文字) | 🟡 浅黄 |
| 10 | `pull` | Pull 拉取(下箭头) | 🟦 青 |
| 11 | `push` | Push 推送(上箭头) | 🟦 蓝 |
| 12 | `reflog` | Reflog 历史(时钟) | 🔵 浅蓝 |
| 13 | `reset` | Reset 重置(回旋+!) | 🔴 红 |

### C · 危险 / 关闭(3)

| # | 文件名 | 含义 | base 色 |
|---|---|---|---|
| 14 | `close` | 关闭(×) | 🔴 红 |
| 15 | `delete` | 删除(垃圾桶) | 🔴 红 |
| 16 | `conflict` | 冲突(警告三角) | 🔴 红 |

### D · 分支相关(8)

| # | 文件名 | 含义 | base 色 |
|---|---|---|---|
| 17 | `branch` | 分支入口(T 字) | 🟦 青 |
| 18 | `new-branch` | 新开分支(嫩芽) | 🟢 绿 |
| 19 | `switch-branch` | 切换分支(Y 字) | 🟣 紫 |
| 44 | `refresh-circle` | 刷新(完整圆+箭头) | 🟢 绿 |
| 45 | `new-branch-plus` | 新开分支(细版+) | 🟢 绿 |
| 46 | `new-branch-bold` | 新开分支(**粗版** +) | 🟢 绿 |

### E · Git 操作 modal(10)

| # | 文件名 | 含义 | base 色 |
|---|---|---|---|
| 20 | `fetch` | 从源抓取(下载) | 🟦 青 |
| 21 | `status` | 查看状态(对勾) | 🟢 绿 |
| 22 | `commit` | 提交(软盘) | 🔵 浅蓝 |
| 23 | `push-remote` | 推送远程(上箭头) | 🟦 蓝 |
| 24 | `log` | 历史(时钟+列表) | 🟡 浅黄 |
| 25 | `clean` | CLEAN 徽章(对勾) | 🟢 绿 |
| 26-29 | 预留 | — | — |
| 30 | `merge` | 合并(标准曲线) | 🟦 青 |
| 31 | `rebase` | 变基(4 角点+4 边) | 🔴 红 |
| 32-43 | 预留 | — | — |

### F · Git 高级操作(+粗线 + 大加号 风格,46 派系)(4)

| # | 文件名 | 含义 | base 色 |
|---|---|---|---|
| 47 | `merge-bold` | 合并(主线+合入+中心 +) | 🟦 青 |
| 48 | `squash-bold` | 压缩(3 合 1 + 中心 +) | 🟣 紫 |
| 49 | `rename-bold` | 重命名(A 字母+右上 +) | 🟦 蓝 |
| 50 | `rebase-bold` | 变基(4 角点+中心 +) | 🔴 红 |

> 47-50 是 46-new-branch-bold 的同款风格变体,用于需要"重点突出 + 号"的 git 操作场景(顶部主按钮、modal 头部)。

---

## 文件命名

```
[序号]-[名称][-状态].svg

01-settings.svg            ← 默认
01-settings-hover.svg      ← 悬停
01-settings-active.svg     ← 按下
01-settings-disabled.svg   ← 禁用
```

无后缀 = default 状态。

**Bold 系列**(47-50)后缀带 `-bold`:
```
47-merge-bold.svg
47-merge-bold-hover.svg
47-merge-bold-active.svg
47-merge-bold-disabled.svg
```

---

## 推荐显示尺寸

| 场景 | 尺寸 |
|---|---|
| 顶部按钮 | 24×24 |
| 工作盘卡片 | 32×32 ~ 40×40 |
| Modal 列表项 | 28×32 |
| 主操作大按钮 | 48×48 ~ 56×56 |

源文件 56×56 viewBox,矢量无损,任意缩放。

---

## 设计原则

1. **透明背景** — 跟 cxx-repodock 原应用风格一致
2. **同色 = 同类操作** — 绿=拉/新建/好,蓝=推/存/分支管理,红=危险,紫=配置/压缩,青=分支合并
3. **4 状态用同色系 3 档明度** — 不混透明度
4. **符号 = 真实功能语义** — 不要用 emoji 凑
5. **形状辅助区分** — 嫩芽 vs Y 字 vs A 字,即使颜色接近也分得清
6. **Bold 系列** — 46 风格,粗线 + 中心节点 + 大 + 号,用于"重点突出 + 号"的操作

---

## 重新生成

```bash
# 用 build-icons.js 重新生成基础 25 个图标
node "A:\project\cxx11\ksw2-server\build-icons.js"

# 用 gen-variants.ps1 批量生成 47-50 的 hover/active/disabled
powershell -NoProfile -ExecutionPolicy Bypass -File "A:\project\cxx11\ksw2-server\gen-variants.ps1"

# 重新打包
powershell -NoProfile -ExecutionPolicy Bypass -File "A:\project\cxx11\ksw2-server\zip.ps1"
```

完整 200 文件清单在 zip 内。
