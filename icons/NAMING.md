# 图标命名规范

**生效日期**: 2026-08-30(初版) / 2026-08-31(追加 Bold 系列)
**适用范围**: cxx-repodock 所有图标文件
**目的**: 统一命名,避免乱起名,让前端同事一眼知道图标用途

---

## 1. 文件命名格式

```
[2位序号]-[类别]-[具体动作].svg
```

**3 段式,中间用 `-` 分隔**

| 段 | 必填 | 说明 |
|---|---|---|
| 序号 | ✓ | 01-99,2 位数字,按"使用频率"或"类别"排序 |
| 类别 | ✓ | 资源 / 工作区 / git 操作 / 分支 / 状态 / 动作 |
| 具体动作 | 看情况 | 同一类别下区分用(如 `new-branch` vs `switch-branch`) |

### Bold 系列变体命名

```
[2位序号]-[动作]-bold.svg          ← 粗 + 号变体(主操作位置用)
```

例:`47-merge-bold.svg`(粗 + 号合并图,用于主操作按钮)

---

## 2. 4 状态后缀(必须)

```
[序号]-[类别]-[动作].svg            ← default(默认)
[序号]-[类别]-[动作]-hover.svg      ← 鼠标悬停
[序号]-[类别]-[动作]-active.svg     ← 按下
[序号]-[类别]-[动作]-disabled.svg   ← 禁用
```

**无后缀 = default**。其他 3 个状态必须带后缀。

### Bold 系列同样要 4 状态

```
47-merge-bold.svg            ← default
47-merge-bold-hover.svg      ← hover
47-merge-bold-active.svg     ← active
47-merge-bold-disabled.svg   ← disabled
```

---

## 3. 序号分配规则(预留,避免乱)

| 区间 | 用途 | 已用 |
|---|---|---|
| 01-09 | 资源类(settings / help / search / file / folder) | 01-07 |
| 08-15 | 系统动作(open / close / cancel / delete / reset / refresh / sync) | 08-16 |
| 17-25 | git 操作(fetch / pull / push / commit / merge / rebase / log / status / clean) | 17-25 |
| 26-29 | 角色/角色部件(legs / body / eyes / hands) | 26-29 |
| 30-39 | 复杂动作(merge / rebase / diff-tree / pinned / pin / workbench / refresh / cancel / workspace / branch-refresh) | 30-43 |
| 40-43 | UI 辅助(compare / more / checkout-remote / workdisk) | 40-43 |
| 44-46 | Bold 系列 · 分支增强(refresh-circle / new-branch-plus / new-branch-bold) | 44-46 |
| 47-50 | Bold 系列 · git 高级操作(merge-bold / squash-bold / rename-bold / rebase-bold) | 47-50 |

**新加图标按区间续号,别插队。**

---

## 4. 类别词汇表(必须从这里选,不要发明新词)

### 资源类(01-09)
- `settings` 设置
- `help` 帮助
- `search` 搜索
- `new-project` 新建项目
- `new-fork` 新建派生
- `open-repo` 打开仓库
- `terminal` 终端
- `file` 文件
- `folder` 文件夹

### 系统动作(08-16)
- `sync` 同步
- `pull` 拉取
- `push` 推送
- `reset` 重置
- `close` 关闭(弹窗)
- `cancel` 取消(操作)
- `delete` 删除
- `conflict` 冲突
- `refresh` 刷新(通用)

### git 操作(17-25)
- `branch` 分支(入口)
- `new-branch` 新开分支
- `switch-branch` 切换分支
- `fetch` 抓取
- `status` 状态
- `commit` 提交
- `log` 历史
- `clean` 干净(徽章)

### 复杂动作(30-39)
- `merge` 合并
- `rebase` 重定基
- `diff-tree` diff 树
- `pinned` 已置顶
- `pin` 可置顶
- `workbench` 工作台(整体)
- `workspace` 工作区(视图)
- `workdisk` 工作盘(worktree)
- `branch-refresh` 刷新分支列表

### UI 辅助(40-49)
- `compare` 对比
- `more` 更多(三点)
- `checkout-remote` 基于远程切本地
- `folder-stack` 文件夹叠放(已用 workdisk)

### Bold 系列(44-50)
- `refresh-circle` 粗版刷新(完整圆 + 顶部箭头)
- `new-branch-plus` 细版新分支(细 + 号)
- `new-branch-bold` 粗版新分支(粗 + 号)
- `merge-bold` 粗版合并(主线 + 合入 + 中心 +)
- `squash-bold` 粗版压缩(3 合 1 + 中心 +)
- `rename-bold` 粗版重命名(A 字母 + 右上 +)
- `rebase-bold` 粗版变基(4 角点 + 中心 +)

**Bold 系列风格**:
- 粗线(`stroke-width=5`,普通 `4`)
- 中心大节点(`r=4.5`,普通 `3.5`)
- 大 + 号叠加在中心节点上
- 周边端点(`r=3.5`)
- 适用场景:**主操作按钮 / modal 头部 / 需要突出 + 号的位置**

---

## 5. 命名原则(铁律)

1. **同义用一词**:
   - 都叫"刷新",统一 `refresh`,不要 refresh / reload / refetch 混用
   - 都叫"对比",统一 `compare`,不要 compare / diff / contrast 混用

2. **不重名(避免歧义)**:
   - 不要 `refresh` 和 `refresh-branch` 都叫"刷新" — 应该 `refresh`(UI 刷新)+ `branch-refresh`(分支列表刷新)
   - 同义词归并:`branch` vs `branches` 用 `branch`

3. **复合名用连字符**:
   - `branch-refresh` ✓
   - `branchRefresh` ✗
   - `BranchRefresh` ✗

4. **动作在前,对象在后**:
   - `pull` ✓ (动作)
   - `branch-pull` ✗ (对象在前)
   - `branch-refresh` ✓ (动作 = refresh,对象 = branch)

5. **避免双关,精准描述**:
   - 不用 `work`(太宽),用 `workbench` / `workspace` / `workdisk` 区分
   - 不用 `branch`(太宽),用 `branch` / `new-branch` / `switch-branch` 区分

6. **不混语言**:
   - 全英文,不混拼音
   - 不混大小写(全小写,连字符分隔)

7. **Bold 系列后缀**:
   - 同图标的标准版(普通粗细)用原名,如 `merge` / `rebase`
   - 粗 + 号变体加 `-bold` 后缀,如 `merge-bold` / `rebase-bold`
   - 不重复原动作,只是"加强版"

---

## 6. 现有图标命名检查清单(50 个)

### ✅ 命名规范(标准版)
- 01-settings, 02-help, 03-new-project, 04-new-fork, 05-search
- 06-open-repo, 07-terminal, 08-sync, 09-file
- 10-pull, 11-push, 12-reflog, 13-reset
- 14-close, 15-delete, 16-conflict
- 17-branch, 18-new-branch, 19-switch-branch
- 20-fetch, 21-status, 22-commit, 23-push-remote, 24-log, 25-clean
- 26-legs, 27-body, 28-eyes, 29-hands
- 30-merge, 31-rebase, 32-diff-tree
- 33-pinned, 34-pin
- 35-workbench, 36-refresh
- 37-cancel, 38-workspace
- 40-compare, 41-more, 42-checkout-remote, 43-workdisk
- 51-compress(蓝/绿/白三色变体), 52-copy, 53-file-inspector, 54-menu-collapse, 55-info-collapse
- 56-file-edit, 57-commit-bold, 58-editor-expand, 59-editor-collapse
- 60-current-branch, 61-expand, 62-collapse
- **63-dismiss**(忽略/驳回,圆圈 + 粗斜线,白系) — 2026-09-12 从 63-ignore 改名 + 改设计
- **64-open-page**(新开页面,主页面 + 副页面双窗口,白系 4 档) — 2026-09-12 新加 + 重画
- **65-editor**(文件编辑器,窗口 + 菜单栏 + 3 条内容线,白系 4 档) — 2026-09-12 新加
- **66-open-with**(打开方式配置,文档 + 简化齿轮,白系 4 档) — 2026-09-12 新加

### ✅ Bold 系列(粗 + 号变体)
- 44-refresh-circle(粗版刷新,绿)
- 45-new-branch-plus(细 + 号新分支,绿)
- 46-new-branch-bold(粗 + 号新分支,绿,**核心参考风格**)
- 47-merge-bold(粗 + 号合并,青)
- 48-squash-bold(粗 + 号压缩,紫)
- 49-rename-bold(粗 + 号重命名,蓝)
- 50-rebase-bold(粗 + 号变基,红)

### ⚠️ 待改进(下次重构时改,**这次不动**)
- **39-refresh-branch** → 应改成 `branch-refresh` — "动作+对象"顺序一致
  - **不改理由**:前端已引用,改了会破代码,等下次重构时一起改
- **23-push-remote** → 应改成 `remote-push` 或 `push-remote`(保持)
  - 现在是"对象+动作"(push-remote 不太对)
  - 实际语义:"推到远程"= push remote,应该 `remote-push` 或 `push-remote`
  - 跟 `42-checkout-remote` 一致,保留 `push-remote` / `checkout-remote`(都"对象-动作"格式)

### 📋 不规范但保留(避免破坏)
- 所有 43 个标准版文件名已固化,前端代码已引用
- 7 个 Bold 系列文件名(44-50)是 2026-08-31 新加,未引用,后续可灵活调整
- 任何重命名需要前后端同步 + git 提交,不能私自改

---

## 7. 新加图标的流程

1. **先查这个文档**,确定序号区间 + 类别 + 命名
2. **写 SVG 4 状态**到 `icons/` 目录
3. **跑 `build-icons.js` 或 `gen-variants.ps1`** 重新生成(可选,手动写也行)
4. **更新 README.md** 加这个图标的"含义/用法/不要用在"
5. **更新 HANDOVER.md** 加功能 → 图标映射表
6. **更新本 NAMING.md** 序号分配表

### 新加 Bold 系列的快速流程

1. 写 default 版到 `icons/[序号]-[动作]-bold.svg`,用 46-new-branch-bold 风格(粗线 + 中心节点 + 大 + 号)
2. 在 `gen-variants.ps1` 加一行映射:`'[序号]-[动作]-bold' = @{ d = '#xxx'; h = '#xxx'; a = '#xxx' }`
3. 跑 `gen-variants.ps1` → 自动生成 hover/active/disabled
4. 跑 `zip.ps1` 重新打包
5. 更新 README.md + HANDOVER.md + 本 NAMING.md

---

## 8. 红线(违反要返工)

- ❌ 不要自创类别词(比如 `git-action`,用 `commit` / `merge` 等具体动作)
- ❌ 不要用中文 / 拼音
- ❌ 不要混大小写
- ❌ 不要超过 99 号
- ❌ 不要漏掉 4 状态中的任何一个
- ❌ 不要改已固化文件的名字(除非全栈同步)
- ❌ 不要在文件名里加版本号(v1, v2)— 用 git 管版本
- ❌ 不要给标准版和 Bold 版起完全不同的名字(如 `merge` vs `merge-2`,应该 `merge` vs `merge-bold`)
